import { Injectable } from '@nestjs/common';
import * as deliveries from './assets/data.json';
import { Delivery } from './interfaces/delivery';
import { createClient } from 'redis';
import { RequestRoute } from './interfaces/request';
import { ResponseRoute } from './interfaces/response';

@Injectable()
export class AppService {

  private redisClient;
  private _deliveries: Delivery[];

  constructor() {

    console.log("REDIS_HOSTNAME", process.env.REDIS_HOSTNAME)
    let redisConf = {
      host: process.env.REDIS_HOSTNAME || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379
    }

    this._deliveries = deliveries;
    this.redisClient = createClient({
      url: `redis://@${redisConf.host}:${redisConf.port}`
    });

    this.redisClient.on("error", function (error) {
      console.error(`❗️ Redis Error: ${error}`)
    })

    this.redisClient.on("ready", () => {
      console.log('✅ 💃 redis have ready !')
    })

    this.redisClient.on("connect", () => {
      console.log('✅ 💃 connect redis success !')
    })

    this.redisClient.connect();
    this.loadDataOnRedis();
  }

  loadDataOnRedis() {
    this._deliveries.forEach(d => {
      this.redisClient.sendCommand(['GEOADD', 'all', d.pickup_location[0].toString(), d.pickup_location[1].toString(), `pickup_${d.id}`])
      this.redisClient.sendCommand(['GEOADD', 'pickup', d.pickup_location[0].toString(), d.pickup_location[1].toString(), `${d.id}`])

      this.redisClient.sendCommand(['GEOADD', 'all', d.delivery_location[0].toString(), d.delivery_location[1].toString(), `delivery_${d.id}`])
      this.redisClient.sendCommand(['GEOADD', 'delivery', d.delivery_location[0].toString(), d.delivery_location[1].toString(), `${d.id}`])
    })
  }

  async scanRoute(req: RequestRoute): Promise<ResponseRoute> {

    // constants
    const maxSearchPoints = 200;
    const radiusDistanceKm = 1;

    // random init position
    const actualPosition = this.getRandomInitialPosition(1, 1000)
    console.log("actualPosition", actualPosition)

    const searchByProximityFromRedis = await this.searchByProximityFromRedis('pickup', actualPosition, maxSearchPoints, radiusDistanceKm)
    console.log("searchByProximityFromRedis")
    console.log(searchByProximityFromRedis)

    let route = new ResponseRoute();
    route.addSteep(actualPosition, 0, 0)

    if (req.considerer_traffic)
      searchByProximityFromRedis.sort((a, b) => {
        return a.traffic - b.traffic;
      });

    console.log("order considerer_traffic searchByProximityFromRedis")
    console.log(searchByProximityFromRedis)

    searchByProximityFromRedis.forEach(s => {
      if (s.distance <= req.maximun_distance_between_points)
        if ((route.maximun_distance + s.distance) <= req.maximun_distance)
          route.addSteep(s.delivery_location, s.distance, s.id)
    })

    return route;
  }

  getRandomInitialPosition(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomIndex = Math.floor(Math.random() * (max - min) + min);
    return this._deliveries[randomIndex].pickup_location
  }

  async searchByProximityFromRedis(list: string, position: number[], maxSearchPoints: number = 2, radius: number = 20000) {

    let resp: Delivery[] = [];
    const searh = await this.redisClient.sendCommand(
      ['GEORADIUS',
        list,
        position[0].toString(),
        position[1].toString(),
        radius.toString(),
        'km',
        'WITHCOORD',
        'WITHDIST',
        'ASC',
        'COUNT',
        maxSearchPoints.toString()])

    searh.forEach(s => {
      resp.push(this.findById(s[0]))
    })

    return resp;
  }

  findById(id: number): Delivery {
    return this._deliveries.find(d => d.id == id)
  }

  findByPickupPosition(position: number[]): Delivery[] {
    return this._deliveries.filter(d => d.pickup_location == position)
  }
}
