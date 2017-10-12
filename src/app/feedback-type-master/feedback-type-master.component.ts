import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { FeedbackTypeService } from '../services/ProviderAdminServices/feedback-type-master-service.service';
import { MdDialog, MdDialogRef} from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-feedback-type-master',
  templateUrl: './feedback-type-master.component.html',
  styleUrls: ['./feedback-type-master.component.css']
})
export class FeedbackTypeMasterComponent implements OnInit {

  search_state: any;
  search_serviceline: any;
  searchForm: boolean = true;
  showTable: boolean = false;
  serviceProviderID: any;
  states = [];
  servicelines = [];
  feedbackTypes = [];
  providerServiceMapID: any;
  confirmMessage: any;
  objs = [];
  @ViewChild('searchFTForm') searchFTForm: NgForm;
  @ViewChild('addForm') addForm: NgForm;
  feedbackExists: boolean = false;
  searchFeedbackArray = [];
  msg = "Feedback Name already exists";

  constructor(private commonData: dataService, private FeedbackTypeService: FeedbackTypeService, private alertService: ConfirmationDialogsService, public dialog: MdDialog) { }

  ngOnInit() {
    this.serviceProviderID = this.commonData.service_providerID;
    this.FeedbackTypeService.getStates(this.serviceProviderID)
    .subscribe((response)=>{
      console.log("states",response);
      this.states = response;
    })
  }

  getServiceLinesfromSearch(state){
    this.FeedbackTypeService.getServiceLines(this.serviceProviderID,state)
    .subscribe((response)=>{
      console.log("services",response);
      this.servicelines = response;
    })
  }

  findFeedbackTypes(providerServiceMapID){
    this.providerServiceMapID = providerServiceMapID;
    this.FeedbackTypeService.getFeedbackTypes({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response)=>{
      console.log("FeedbackTypes",response);
      this.feedbackTypes = response;
      this.showTable = true;
    })
  }

  clear(){
    this.searchFTForm.resetForm();
    console.log("state",this.search_state);
    console.log("serviceLine",this.search_serviceline);
    this.feedbackTypes = [];
    this.showTable = false;
  }

  editFeedback(feedbackObj){
    console.log("feedbackObj",feedbackObj);
    let dialog_Ref = this.dialog.open(EditFeedbackModal, {
      width: '500px',
      data: {
        'feedbackObj': feedbackObj,
        'feedbackTypes': this.feedbackTypes 
      }
    });

    dialog_Ref.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.findFeedbackTypes(this.providerServiceMapID);
      }

    });
  }

  activeDeactivate(id, flag){
    let obj = {
      "feedbackTypeID": id,
      "deleted": flag
    }
    if (flag) {
      this.confirmMessage = 'Deactivate';
    } else {
      this.confirmMessage = 'Activate';
    }
    this.alertService.confirm("Are you sure want to "+this.confirmMessage+"?").subscribe((res)=>{
      if (res) {
        console.log("reqObj",obj);
        this.FeedbackTypeService.deleteFeedback(obj)
        .subscribe((res)=>{
          this.alertService.alert(this.confirmMessage+"d successfully");
          this.findFeedbackTypes(this.providerServiceMapID);
        },
        (err)=>{
          console.log(err);
        })
      }
    },
    (err)=>{
      console.log(err);
    })
  }

  changeTableFlag(flag){
    this.searchForm = flag;
  }

  validateFeedback(feedback){
    // console.log("check",feedback);
    this.feedbackExists = false;
    this.searchFeedbackArray = this.feedbackTypes.concat(this.objs);
    console.log("searchArray",this.searchFeedbackArray);
    let count = 0;
    for(var i=0; i< this.searchFeedbackArray.length;i++){
      if(feedback.toUpperCase()===this.searchFeedbackArray[i].feedbackTypeName.toUpperCase()){
        // console.log("gotcha",feedback,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if(count>0){
      // console.log("error found");
      this.feedbackExists = true;
    }
  }

  saveFeedback(){
    // console.log("dataObj", obj);
    var tempArr = [];
    for(var i=0; i < this.objs.length;i++){
      var tempObj = {
        "feedbackTypeName": this.objs[i].feedbackName,
        "feedbackDesc": this.objs[i].feedbackDesc,
        "providerServiceMapID": this.providerServiceMapID,
        "createdBy": "Admin"
      }
      tempArr.push(tempObj);
    }
   
    console.log("reqObj", tempArr);
    this.FeedbackTypeService.saveFeedback(tempArr)
    .subscribe((res)=>{
      console.log("response",res);
      this.searchForm = true;
      this.alertService.alert("Feedback Type saved successfully");
      this.addForm.resetForm();
      this.objs = [];
      this.findFeedbackTypes(this.providerServiceMapID);
    })
  }

  add_obj(name,desc){
    var tempObj = {
      "feedbackTypeName": name,
      "feedbackDesc": desc
    }
    console.log(tempObj);
    this.objs.push(tempObj);
    this.validateFeedback(name);
  }

  remove_obj(index){
    this.objs.splice(index,1);
  }

}

@Component({
  selector: 'editFeedbackModal',
  templateUrl: './edit-feedback-type-dialog.html',
})
export class EditFeedbackModal {

  feedbackName: any;
  feedbackDesc: any;
  originalName: any;
  searchFeedbackArray = [];
  feedbackExists: boolean = false;
  msg = "Feedback Name already exists";

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
  public FeedbackTypeService: FeedbackTypeService,
  public dialog_Ref: MdDialogRef<EditFeedbackModal>,
  private alertService: ConfirmationDialogsService) { }
  
  ngOnInit() {
    console.log("update this data",this.data);
    this.feedbackName = this.data.feedbackObj.feedbackTypeName;
    this.originalName = this.data.feedbackObj.feedbackTypeName;
    this.feedbackDesc = this.data.feedbackObj.feedbackDesc;
    this.searchFeedbackArray = this.data.feedbackTypes;
  }

  update(){
    var tempObj = {
      "feedbackTypeID": this.data.feedbackObj.feedbackTypeID,
      "feedbackTypeName": this.feedbackName,
      "feedbackDesc": this.feedbackDesc,
      "modifiedBy": this.data.feedbackObj.createdBy
    }
    
    this.FeedbackTypeService.editFeedback(tempObj)
    .subscribe((res)=>{
      this.dialog_Ref.close("success");
      this.alertService.alert("Feedback Type edited successfully");
    })
    
  }

  validateFeedback(feedback){
    console.log("check",feedback);
    this.feedbackExists = false;
    console.log("searchArray",this.searchFeedbackArray);
    let count = 0;
    for(var i=0; i< this.searchFeedbackArray.length;i++){
      if(feedback.toUpperCase()===this.searchFeedbackArray[i].feedbackTypeName.toUpperCase() && feedback.toUpperCase()!=this.originalName.toUpperCase()){
        // console.log("gotcha",feedback,"exists");
        count++;
      }
      // console.log(i,"iterating");
    }
    if(count>0){
      // console.log("error found");
      this.feedbackExists = true;
    }
  }
}