
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';

import { IonContent } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  mailOutline,
  callOutline,
  arrowForwardOutline,
  arrowBackOutline,
  resizeOutline,
  layersOutline,
  printOutline,
  locationOutline,
  sendOutline,
  logoWhatsapp,
  closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  @ViewChild(IonContent)
  content!: IonContent;

  @ViewChild('catalogoCinta', { read: ElementRef })
  catalogoCinta!: ElementRef<HTMLElement>;

  // Año que aparece automáticamente en el pie de página.
  anioActual = new Date().getFullYear();

  // Número de WhatsApp con código de país.
  // México: 52 + número de teléfono.
  private telefonoWhatsApp = '525665315536';

  // Estado de la ventana de imágenes.
  isImageModalOpen = false;

  imagenSeleccionada: string | null = null;

  descripcionImagenSeleccionada = '';

  constructor() {
    addIcons({
      mailOutline,
      callOutline,
      arrowForwardOutline,
      arrowBackOutline,
      resizeOutline,
      layersOutline,
      printOutline,
      locationOutline,
      sendOutline,
      logoWhatsapp,
      closeOutline
    });
  }

  // Navegar a una sección de la página.
  async irASeccion(
    id: string,
    event?: Event
  ): Promise<void> {

    event?.preventDefault();

    const seccion = document.getElementById(id);

    if (!seccion || !this.content) {
      return;
    }

    const scrollElement =
      await this.content.getScrollElement();

    const posicion =
      seccion.getBoundingClientRect().top -
      scrollElement.getBoundingClientRect().top +
      scrollElement.scrollTop;

    await this.content.scrollToPoint(
      0,
      posicion,
      500
    );
  }

  // Desplazar el catálogo horizontalmente.
  desplazarCatalogo(direccion: number): void {

    const cinta = this.catalogoCinta?.nativeElement;

    if (!cinta) {
      return;
    }

    cinta.scrollBy({
      left: direccion * 290,
      behavior: 'smooth'
    });
  }

  // Abrir la imagen seleccionada.
  abrirImagen(
    ruta: string,
    descripcion: string
  ): void {

    this.imagenSeleccionada = ruta;

    this.descripcionImagenSeleccionada = descripcion;

    this.isImageModalOpen = true;
  }

  // Cerrar la ventana de imagen.
  cerrarImagen(): void {

    this.isImageModalOpen = false;

    this.imagenSeleccionada = null;

    this.descripcionImagenSeleccionada = '';
  }

  // Evitar el menú contextual habitual sobre las imágenes.
  bloquearMenuContextual(event: Event): void {
    event.preventDefault();
  }

  // Bloquear el clic derecho sobre imágenes de la página.
  @HostListener('contextmenu', ['$event'])
  protegerImagenes(event: MouseEvent): void {

    const elemento = event.target;

    if (
      elemento instanceof Element &&
      elemento.closest('img')
    ) {
      event.preventDefault();
    }
  }

  // Evitar el arrastre nativo de imágenes.
  @HostListener('dragstart', ['$event'])
  protegerArrastreImagenes(event: DragEvent): void {

    const elemento = event.target;

    if (
      elemento instanceof Element &&
      elemento.closest('img')
    ) {
      event.preventDefault();
    }
  }

  // Abrir WhatsApp con un mensaje preparado.
  contactarWhatsApp(): void {

    const mensaje = encodeURIComponent(
      'Hola, quisiera más información y una cotización ' +
      'de etiquetas para acumuladores.'
    );

    const url =
      `https://wa.me/${this.telefonoWhatsApp}?text=${mensaje}`;

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  }

  // Preparar la solicitud de cotización por correo.
  enviarCotizacion(event: Event): void {

    event.preventDefault();

    const formulario =
      event.currentTarget as HTMLFormElement;

    const nombre = this.obtenerValor(
      formulario,
      'nombre'
    );

    const telefono = this.obtenerValor(
      formulario,
      'telefono'
    );

    const producto = this.obtenerValor(
      formulario,
      'producto'
    );

    const mensaje = this.obtenerValor(
      formulario,
      'mensaje'
    );

    const asunto = encodeURIComponent(
      `Solicitud de cotización: ${producto}`
    );

    const cuerpo = encodeURIComponent(
      `Hola, deseo solicitar una cotización.\n\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Tipo de etiqueta: ${producto}\n\n` +
      `Detalles de la solicitud:\n${mensaje}`
    );

    const url =
      `mailto:etiquetasacumuladores@gmail.com` +
      `?subject=${asunto}&body=${cuerpo}`;

    window.location.href = url;
  }

  // Obtener el valor de los campos de Ionic.
  private obtenerValor(
    formulario: HTMLFormElement,
    nombre: string
  ): string {

    const componente = formulario.querySelector(
      `ion-input[name="${nombre}"], ` +
      `ion-textarea[name="${nombre}"]`
    ) as (HTMLElement & { value?: string }) | null;

    return String(
      componente?.value ?? ''
    ).trim();
  }
}
