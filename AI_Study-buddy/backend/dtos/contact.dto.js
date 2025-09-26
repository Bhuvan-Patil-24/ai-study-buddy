export class ContactDTO {
  constructor({ name, email, message, subject, phone }) {
    this.name = name;
    this.email = email;
    this.message = message;
    this.subject = subject;
    this.phone = phone;
  }

  validate() {
    if (
      !this.name ||
      !this.email ||
      !this.message ||
      !this.subject ||
      !this.phone
    ) {
      throw new Error(
        "Name, email, subject, phone number and message are required."
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error("Invalid email format.");
    }
  }
}
