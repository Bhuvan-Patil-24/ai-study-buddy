export class UserRegisterDto {
    constructor({ name, email, password, role }) {
      this.name = name;
      this.email = email;
      this.password = password;
    }
  
    validate() {
      if (!this.name || !this.email || !this.password) {
        throw new Error("Name, email, and password are required.");
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        throw new Error("Invalid email format.");
      }
  
      if (this.password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
    }
  }
  
  export class UserLoginDto {
    constructor({ email, password }) {
      this.email = email;
      this.password = password;
    }
  
    validate() {
      if (!this.email || !this.password) {
        throw new Error("Email and password are required.");
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        throw new Error("Invalid email format.");
      }
  
      if (this.password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
    }
  }
  