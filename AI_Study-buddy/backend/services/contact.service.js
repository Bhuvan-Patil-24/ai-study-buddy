import { Contact } from "../models/Contact.js";
import { logger } from "../logger/logger.js";

export class ContactService {
  async createContact(dto) {
    const contact = await Contact.create(dto);
    logger.info(`New contact: ${dto.email}`);
    return contact;
  }

  async getContacts() {
    return await Contact.find().sort({ createdAt: -1 });
  }
}

export const contactService = new ContactService();
