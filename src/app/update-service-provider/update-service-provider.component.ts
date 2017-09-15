import { Component, OnInit } from '@angular/core';
import { SuperAdmin_ServiceProvider_Service } from "../services/adminServices/AdminServiceProvider/superadmin_serviceprovider.service";

@Component({
  selector: 'app-update-service-provider',
  templateUrl: './update-service-provider.component.html',
  styleUrls: ['./update-service-provider.component.css']
})
export class UpdateServiceProviderComponent implements OnInit {

	allProviders: any =[];
	providerSelected: any;
	data: any = [];
	showProvider: boolean = false;
	searchPage: boolean = true;
	countryID= 1;
	states: any = [];
	servicelines:any = [];
	state:any;
	serviceline: any;
  constructor(public super_admin_service: SuperAdmin_ServiceProvider_Service) { }

  ngOnInit() {
  	this.super_admin_service.getAllProvider().subscribe(response => this.providerData_successHandler(response));
  	this.super_admin_service.getAllStates(this.countryID).subscribe(response =>  this.getAllStates(response));

  }

  providerData_successHandler(response) {
  		this.allProviders = response;
  		console.log(response.length);
  }
  selectedProvider(provider) {
  	this.showProvider = true;
  	this.super_admin_service.getProviderStatus(provider).subscribe(response => this.providerInfo_handler(response));
  }
  providerInfo_handler(response) {
  		this.data = response;
  }
  addOrModify() {
  	this.searchPage = false;
  }
  back() {
  	this.searchPage = true;
  	this.state="";
  	this.serviceline="";
  	this.servicelines = [];
  }
  getAllStates(response) {
  	this.states = response;
  }
  getAllServicelines(response) {
  	let tempService={};
  	let temp:boolean;
  	for(var i=0; i<response.length; i++) {
  		temp = true;
  		for(var a=0; a<this.array.length; a++) {
  			if(response[i].serviceID == this.array[a].serviceID) {
  				temp = false;
  			}
  		}
  		if(temp) {
  		tempService = response[i];
  		this.servicelines.push(tempService);
  		tempService={};
  		}
  	}
  	console.log(this.servicelines);

  }
  array: any=[];
  getValidServicelines(value) {
  	this.servicelines = [];
  	this.array = [];
  	let tempState = {};
  	// let res = this.data.filter(function(obj) {
  	// 	if(obj.stateID == value)
  	// 	{
  	// 		 a = obj;
  	// 		 this.array.push(a);
  	// 	}
  	// 	console.log(a);
  		
  	// 	a={};
  	// 	debugger;
  	// })
  	for(var i=0; i<this.data.length; i++){
  		if(this.data[i].stateID == value)
  		{
  			 tempState = this.data[i];
  			 this.array.push(tempState);
  		}
  		tempState={};
  	}
  	console.log(this.array);
  	  	this.super_admin_service.getAllServiceLines().subscribe(response =>  this.getAllServicelines(response));

  }
  modifyProvider(value){
  	alert("need to integrate with update API ");
  	this.searchPage = true;
  	this.state="";
  	this.serviceline="";
  	this.servicelines = [];
  	debugger;
  }
}