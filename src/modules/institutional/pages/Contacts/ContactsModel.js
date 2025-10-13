export class ContactsModel {
  constructor() {
    this.contactItems = [
      { id: 'mail', icon: 'FaEnvelope', route: '/' },
      { id: 'whatsapp', icon: 'FaWhatsapp', route: '/' },
      { id: 'instagram', icon: 'FaInstagram', route: '/' },
      { id: 'facebook', icon: 'FaFacebook', route: '/' },
    ]
  }
}
