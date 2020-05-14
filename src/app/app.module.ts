import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HomeComponent } from './components/home/home.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { CaptionComponent } from './components/caption/caption.component';
import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { RouterModule, Routes } from '@angular/router';
import { ImageComponent } from './components/image/image.component';

registerLocaleData(en);

const appRoutes: Routes = [
  { path: '', component: FrontpageComponent, data: {animation : 'Home'} },
  { path: 'editor/:name', component: HomeComponent, data: {animation : 'Editor'} },
  { path: 'editor', component: HomeComponent, data: {animation : 'Editor'} },
  { path: '**', component: FrontpageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ColorPickerComponent,
    CaptionComponent,
    FrontpageComponent,
    ImageComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
    ),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularDraggableModule
  ],
  entryComponents: [CaptionComponent, ImageComponent],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
