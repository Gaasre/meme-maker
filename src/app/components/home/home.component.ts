import { Component, OnInit, ViewChild, ElementRef, Renderer2, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { CaptionComponent } from '../caption/caption.component';
import { ActivatedRoute } from '@angular/router';
import { MemesService } from '../../services/memes.service';
import { ImageComponent } from '../image/image.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  selectedMeme;
  searchValue = '';

  memes = [];

  memesOutput = [];

  selectedElement;
  elements = [];
  id = 1;
  subscription;

  @ViewChild('design')
  private design: ElementRef;

  constructor(private renderer: Renderer2, private cfResolver: ComponentFactoryResolver, public vcRef: ViewContainerRef,
              private route: ActivatedRoute, private memeService: MemesService) { }

  ngOnInit() {
    this.memeService.getMemes().toPromise().then((res: any) => {
      this.memes = res;
      this.memes.forEach(x => this.memesOutput.push(x));
      let name = '';
      this.subscription = this.route.params.subscribe(params => {
        if (params.name) {
          name = params.name;
          this.selectedMeme = this.memes.map((value) => {
            return { img: value.img, name: value.name };
          }).find(x => x.img.includes(name));
        } else {
          this.selectedMeme = this.memes[0];
        }
      });
    });
  }

  Search(event) {
    // tslint:disable-next-line:only-arrow-functions
    this.memesOutput = this.memes.map((value) => {
      return { img: value.img, name: value.name.toLowerCase() };
    }).filter(x => x.name.includes(event.toLowerCase()));
  }

  changeFontSize(event) {
    this.renderer.setStyle(this.selectedElement.ref.children[0].children[0], 'font-size', event + 'px');
  }

  changeText(event) {
    this.renderer.setProperty(this.selectedElement.ref.children[0].children[0], 'innerHTML', event);
  }

  changeColor(event) {
    this.selectedElement.color = event;
    this.renderer.setStyle(this.selectedElement.ref.children[0].children[0], 'color', event);
  }

  deselectAll() {
    this.elements.forEach(x => this.renderer.removeClass(x.ref.children[0], 'selected'));
    this.selectedElement = null;
  }

  toBold() {
    this.selectedElement.isBold = !this.selectedElement.isBold;
    this.renderer.setStyle(this.selectedElement.ref.children[0].children[0], 'font-weight',
      this.selectedElement.isBold ? 'bold' : 'normal');
  }

  /*rotateLeft() {
    this.renderer.setStyle(this.selectedElement.ref.children[0], 'transform',
      this.selectedElement.ref.children[0].style.transform.replace('rotate(' + this.selectedElement.rotation + 'rad)',
      'rotate(' + (this.selectedElement.rotation - 0.05) + 'rad)'));
    this.selectedElement.rotation -= 0.05;
  }

  rotateRight() {
    this.renderer.setStyle(this.selectedElement.ref.children[0], 'transform',
      this.selectedElement.ref.children[0].style.transform.replace('rotate(' + this.selectedElement.rotation + 'rad)',
       'rotate(' + this.selectedElement.rotation + 0.05 + 'rad)'));
    this.selectedElement.rotation += 0.05;
  }*/

  Delete() {
    this.elements = this.elements.filter(x => x.ref !== this.selectedElement);
    this.renderer.removeChild(this.design.nativeElement, this.selectedElement.ref);
    this.selectedElement = null;
  }

  Oblique() {
    this.selectedElement.isOblique = !this.selectedElement.isOblique;
    this.renderer.setStyle(this.selectedElement.ref.children[0].children[0], 'font-style',
      this.selectedElement.isOblique ? 'italic' : 'normal');
  }

  Underline() {
    this.selectedElement.isUnderlined = !this.selectedElement.isUnderlined;
    this.renderer.setStyle(this.selectedElement.ref.children[0].children[0], 'text-decoration',
      this.selectedElement.isUnderlined ? 'underline' : 'none');
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.deselectAll();
      const factory = this.cfResolver.resolveComponentFactory(ImageComponent);
      const componentRef = this.vcRef.createComponent(factory);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        componentRef.location.nativeElement.children[0].children[0].src = reader.result;
        this.renderer.listen(componentRef.location.nativeElement, 'mousedown', () => {
          this.elements.filter((elem) => elem.ref !== componentRef.location.nativeElement)
            .forEach(x => this.renderer.removeClass(x.ref.children[0], 'selected'));
          this.renderer.addClass(componentRef.location.nativeElement.children[0], 'selected');
          this.selectedElement = this.elements.find(elem => elem.ref === componentRef.location.nativeElement);
        });
        this.renderer.insertBefore(this.design.nativeElement, componentRef.location.nativeElement,
          this.design.nativeElement.firstChild);
        const generatedElement = {
          ref: componentRef.location.nativeElement,
          type: 'img',
          rotation: 0,
        };
        this.selectedElement = generatedElement;
        this.elements.push(generatedElement);
      };
    }
  }

  addText() {
    this.deselectAll();
    const factory = this.cfResolver.resolveComponentFactory(CaptionComponent);
    const componentRef = this.vcRef.createComponent(factory);
    this.renderer.listen(componentRef.location.nativeElement, 'mousedown', () => {
      this.elements.filter((elem) => elem.ref !== componentRef.location.nativeElement)
        .forEach(x => this.renderer.removeClass(x.ref.children[0], 'selected'));
      this.renderer.addClass(componentRef.location.nativeElement.children[0], 'selected');
      this.selectedElement = this.elements.find(elem => elem.ref === componentRef.location.nativeElement);
    });
    this.renderer.insertBefore(this.design.nativeElement, componentRef.location.nativeElement,
      this.design.nativeElement.firstChild);
    const generatedElement = {
      ref: componentRef.location.nativeElement,
      type: 'text',
      content: 'New Caption',
      size: 14,
      color: '#fff',
      isBold: true,
      isUnderlined: false,
      isOblique: false,
      rotation: 0,
    };
    this.selectedElement = generatedElement;
    this.elements.push(generatedElement);
  }

  selectMeme() {
    this.selectedElement = null;
    this.elements.forEach(elem => this.renderer.removeChild(this.design.nativeElement, elem.ref));
    this.elements = [];
  }

  Save() {
    this.deselectAll();
    htmlToImage.toBlob(this.design.nativeElement, {
      width: this.design.nativeElement.clientWidth,
      height: this.design.nativeElement.clientHeight,
      style: {
        margin: 0,
        'box-shadow': 'none'
      }
    })
      .then((blob) => {
        saveAs(blob, 'meme.png');
      });
  }

}
