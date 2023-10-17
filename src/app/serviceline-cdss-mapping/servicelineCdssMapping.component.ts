import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MdDialog } from "@angular/material";
import { EmployeeMasterNewServices } from "app/services/ProviderAdminServices/employee-master-new-services.service";
import { InstituteDirectoryMasterService } from "app/services/ProviderAdminServices/institute-directory-master-service.service";
import { dataService } from "app/services/dataService/data.service";
import { ConfirmationDialogsService } from "app/services/dialog/confirmation.service";


@Component({
    selector: 'app-serviceline-cdss-mapping',
    templateUrl: './servicelineCdssMapping.component.html',
    styleUrls: ['./servicelineCdssMapping.component.css']
  })
export class ServicelineCdssMapping implements OnInit {
  services: any = [];
	states: any = [];
  userID: any;
  state: any;
  stateID:any;
  serviceCdss:any;
  service: any;
  serviceID: any;
  nationalFlag: any;
  providerServiceMapID: any;
  isCdssForm: boolean = false;
  showActivateFlag: boolean = false;
  showDeactivateFalg : boolean = false;
  createdBy: any;
  cdssServices: any;
  
    constructor(public instituteDirectoryService: InstituteDirectoryMasterService,
      public commonDataService: dataService,
      public dialogService: ConfirmationDialogsService,
      public dialog: MdDialog) { }
  
    ngOnInit() {
      this.userID = this.commonDataService.uid;
      this.createdBy = this.commonDataService.uname;
      // this.providerServiceMapID = this.commonDataService.provider_serviceMapID;
      //	this.instituteDirectoryService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response)); // commented on 10/4/18(1097 regarding changes) Gursimran
      this.instituteDirectoryService.getServiceLinesNewCdss(this.userID).subscribe((response) => {
        this.successhandeler(response)
        ,
          (err) => {
            console.log("ERROR in fetching serviceline", err);
            //this.alertService.alert(err, 'error');
          }
      });
    }
    
    successhandeler(res) {
      this.services = res.filter(function (item) {
        console.log("item", item);      
          return item;  
      })
      // this.cdssServices = this.services[0].serviceName;
      // this.service = this.cdssServices;
    }
    getStates(value) {
      let obj = {
        'userID': this.userID,
        'serviceID': value.serviceID,
        'isNational': value.isNational
      }
      this.instituteDirectoryService.getStatesNew(obj).
        subscribe(response => this.getStatesSuccessHandeler(response, value), (err) => {
          console.log("error in fetching states", err);
          this.serviceID = value.serviceID;
          //this.alertService.alert(err, 'error');
        });
    }

    getStatesSuccessHandeler(response, value) {

      this.states = response;
      if (value.isNational) {
        this.nationalFlag = value.isNational;
        this.setProviderServiceMapID(response[0].providerServiceMapID);
        this.stateID = value.stateID;
      }
      else {
        this.nationalFlag = value.isNational;
      }
    }
    setProviderServiceMapID(providerServiceMapID) {
      console.log("providerServiceMapID", providerServiceMapID);
      this.providerServiceMapID = providerServiceMapID;
      this.fetchCdssDetails();
      // this.showActivateFlag = true;
    }

    activateDeactivateCdss(){
     
      this.isCdssForm = true;
      let reqObj = {
        'psmId' : this.providerServiceMapID,
        'serviceId' : this.service.serviceID,
        'stateId': this.state.stateID,
        'isCdss': this.isCdssForm,
        'createdBy': this.createdBy
      }
      this.instituteDirectoryService.saveCdssMapping(reqObj).
        subscribe(response => this.saveSuccessHandeler(response), (err) => {
          console.log("error in fetching states", err);
          //this.alertService.alert(err, 'error');
        });
     this.resetForm();
    }

    DeactivateCdss(){
      this.showDeactivateFalg = true;
      this.isCdssForm = false;
      let reqObj = {
        'psmId' : this.providerServiceMapID,
        'serviceId' : this.service.serviceID,
        'stateId': this.state.stateID,
        'isCdss': this.isCdssForm,
        'createdBy': this.createdBy
      }
      this.instituteDirectoryService.saveCdssMapping(reqObj).
        subscribe(response => this.saveDeactivateCdss(response), (err) => {
          console.log("error in fetching states", err);
          //this.alertService.alert(err, 'error');
        });
     this.resetForm();
    }
    saveSuccessHandeler(response) {
      console.log("response", response);
      if (response) {
        this.dialogService.alert("Activated successfully", 'success');
      }
    }
    saveDeactivateCdss(response){
      console.log("response", response);
      if (response) {
        this.dialogService.alert("Deativated successfully", 'success');
      }
    }

  resetForm(){
    this.service = '';
    this.state = '';
    this.showActivateFlag = false;
    this.showDeactivateFalg = false;
  }
  fetchCdssDetails(){
    let reqobj =  this.providerServiceMapID;
    this.instituteDirectoryService.getCdssDetails(reqobj).subscribe(response =>
       this.getCdssSuccessHandeler(response)
       ,
    (err) => {
      console.log("error in fetching cdss Details", err);
      //this.alertService.alert(err, 'error');
    });
  }
  getCdssSuccessHandeler(value){
  if(value.isCdss !== null && value.isCdss !== undefined && value.isCdss == true){
    this.showActivateFlag = false;
    this.showDeactivateFalg = true;
  }else{
     this.showActivateFlag = true;
     this.showDeactivateFalg = false;
  }
  }
  }