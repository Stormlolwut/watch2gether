import { SharedModule } from "./../shared.module";
import { NgModule } from "@angular/core";
import { RoomsPageRoutingModule } from "./rooms-routing.module";
import { RoomsPage } from "./rooms.page";

@NgModule({
  imports: [RoomsPageRoutingModule, SharedModule],
  declarations: [RoomsPage]
})
export class RoomsPageModule {}
