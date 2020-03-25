import { MenuComponent } from "./menu/menu.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [MenuComponent],
  exports: [MenuComponent, CommonModule, FormsModule, IonicModule]
})
export class SharedModule {}
