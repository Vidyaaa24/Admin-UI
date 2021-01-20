import { Observable } from 'rxjs/Rx';
import { CommonDialogComponent } from './../../common-dialog/common-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ConfirmationDialogsService {
    private isShown: boolean = false;
    constructor(private dialog: MdDialog, @Inject(DOCUMENT) doc: any) {
    }

    public confirm(title: string, message: string, status: string = 'info',
        btnOkText: string = 'Ok', btnCancelText: string = 'Cancel'): Observable<boolean> {
        let dialogRef: MdDialogRef<CommonDialogComponent>;
        const config = new MdDialogConfig();
        dialogRef = this.dialog.open(CommonDialogComponent, {
            // height: '30%',
            // width: '30%',
            disableClose: false
        });
        // dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.btnOkText = btnOkText;
        dialogRef.componentInstance.btnCancelText = btnCancelText;
        dialogRef.componentInstance.confirmAlert = true;
        dialogRef.componentInstance.alert = false;
        dialogRef.componentInstance.status = status;
        return dialogRef.afterClosed();
    }

    public confirmWithoutContainer(title: string, message: string,status: string = 'info', titleAlign: string = 'center',
        messageAlign: string = 'center', btnOkText: string = 'Ok', btnCancelText: string = 'Cancel'): Observable<boolean> {

        let dialogRef: MdDialogRef<CommonDialogComponent>;
        const config = new MdDialogConfig();
        // config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(CommonDialogComponent, config);
        dialogRef.componentInstance.status = status;
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.btnOkText = btnOkText;
        dialogRef.componentInstance.btnCancelText = btnCancelText;
        dialogRef.componentInstance.confirmAlert = true;
        dialogRef.componentInstance.alert = false;
        return dialogRef.afterClosed();
    }

    public alert( message: string, status: string = 'info', titleAlign: string = 'center',
    messageAlign: string = 'center', btnOkText: string = 'Ok'): void {
        let dialogRef: MdDialogRef<CommonDialogComponent>;
        const config = new MdDialogConfig();
        // config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(CommonDialogComponent, config);
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.btnOkText = btnOkText;
        dialogRef.componentInstance.confirmAlert = false;
        dialogRef.componentInstance.alert = true;
        dialogRef.componentInstance.status = status;
    }


    public alertConfirm(message: string, status: string = 'info', titleAlign: string = 'center',
    messageAlign: string = 'center', btnOkText: string = 'Ok'): Observable<any> {
    if (!this.isShown) {
        let dialogRef: MdDialogRef<CommonDialogComponent>;
        const config = new MdDialogConfig();
        // config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(CommonDialogComponent, config);
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.status = status;
        dialogRef.componentInstance.btnOkText = btnOkText;
        dialogRef.componentInstance.confirmAlert = false;
        dialogRef.componentInstance.alert = true;
        dialogRef.afterClosed().subscribe(res => {
            this.isShown = false;
        }
        )
        this.isShown = true;
        return dialogRef.afterClosed();
    }
}




}
