import { Component, OnInit, Pipe, Input, SimpleChanges } from '@angular/core';
import { jsonService } from '../../json.service';
import { Places } from '../../places';
import { Activities } from '../../activities';
import { Events } from '../../events';
import { KilometerToMeterPipe } from '../../kilometer-to-meter.pipe';
import { FilterComponent } from '../filter.component';
import { Filters } from 'src/app/filters';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @Input() mainFilter: any;

  FilterComponent: any = FilterComponent;

  places: Places[] = [];
  activities: Activities[] = [];
  events: Events[] = [];
  km: any;
  userCoordinates: number[] = [];

  filter: Filters[] = [];
  place = false;
  event = false;
  activity = false;

  constructor(private jsonService: jsonService,private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.getData(this.mainFilter);
  }
  // setFilter(filter: any): void {
  //   this.getData(filter);
  // }

  ngOnInit(): void {
    this.getUserLocation();
    this.getData(this.mainFilter);
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      this.userCoordinates.push(userLat);
      this.userCoordinates.push(userLon);
    });
  }
  
  getData(filter: any): void {
    console.log('getting data');
    if (filter === 'places') {
      console.log('getting places');
      // this.jsonService.getPlaces().subscribe((res: Places) => {
      this.apiService.getAllPlaces().subscribe((res: Places) => {
        this.filter = [];
        this.filter.push(res);
        // here we set the distance to user for each place (the Activities interface is updated with this new property).
  // getData(filter: any): void {
  //   console.log('getting data');
  //   if (filter === 'places') {
  //     let tag = 'Park';
  //     let check: { data: any; }[] = [];
  //     this.filter = [];
  //     this.apiService.getAllPlaces().subscribe((res: Places) => {
  //       check.push(res);
  //       for (let data of check[0].data) {
  //         for (let i = 0; i < data.tags.length; i++) {
  //           console.log(data.tags[1].name);
  //           if (data.tags[i].name === tag) {
  //             this.filter.push(data);
  //           }
  //         }
  //       }
        // here we set the distance to user for each place (the Activities interface is updated with this new property).
        for (let data of this.filter[0].data) {
          data.distance = this.getDistance(this.userCoordinates, [
            data.location.lat,
            data.location.lon,
          ]);
        }
        this.filter[0].data.sort((a: any, b: any) => a.distance - b.distance);
      });
    } else if (filter === 'events') {
      console.log('getting events');
      // this.jsonService.getEvents().subscribe((res: Events) => {
      this.apiService.getAllEvents().subscribe((res: Events) => {
        this.filter = [];
        this.filter.push(res);
        // here we set the distance to user for each place (the Activities interface is updated with this new property).
        for (let data of this.filter[0].data) {
          data.distance = this.getDistance(this.userCoordinates, [
            data.location.lat,
            data.location.lon,
          ]);
        }
        this.filter[0].data.sort((a: any, b: any) => a.distance - b.distance);
      });
    } else if (filter === 'activities') {
      // this.jsonService.getActivities().subscribe((res: Activities) => {
      this.apiService.getAllActivities().subscribe((res: Activities) => {
        this.filter = [];
        this.filter.push(res);
        // here we set the distance to user for each place (the Activities interface is updated with this new property).
        for (let data of this.filter[0].data) {
          data.distance = this.getDistance(this.userCoordinates, [
            data.location.lat,
            data.location.lon,
          ]);
        }
        this.filter[0].data.sort((a: any, b: any) => a.distance - b.distance);
      });
    }
  }

  // takes two sets of coordinates as parameters, e.g. getDistance([10.0, 11.0], [30.0, 40.0]). return distance in meters
  getDistance(origin: number[], destination: number[]): number {
    var lon1 = this.toRadian(origin[1]),
      lat1 = this.toRadian(origin[0]),
      lon2 = this.toRadian(destination[1]),
      lat2 = this.toRadian(destination[0]);
    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;
    var a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    var distance = c * EARTH_RADIUS;
    return distance;
  }

  toRadian(degree: number) {
    return (degree * Math.PI) / 180;
  }

  showDistance(place: any) {
    let distance = place.distance * 1000;
    if (distance < 1000) {
      return distance.toFixed(0) + ' m';
    }
    distance = place.distance;
    return distance.toFixed(2) + ' km';
  }
}
