import { contactService } from "../services/contact.service.js";
import ResponseHandler from "../utils/apiResponse.js";

export class ContactController {
  createContact = async (req, res, next) => {
    const response = new ResponseHandler(res);
    try {
      const contact = await contactService.createContact(req.dto);
      response.success(contact, "Contact created", 201);
    } catch (error) {
      response.error(null, error.message || "Something went wrong", 500);
    }
  };

  getContacts = async (req, res, next) => {
    const response = new ResponseHandler(res);
    try {
      const contacts = await contactService.getContacts();
      response.success(contacts, "Contact fetched successfully");
    } catch (error) {
      response.error(null, error.message || "Something went wrong", 500);
    }
  };
}
