import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,],
    declarations: [MenuComponent],
    exports: [MenuComponent, CommonModule, FormsModule, IonicModule]
})
export class SharedModule { }