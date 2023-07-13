import IUser from '../../common/interface/user.interface';

export default class Manager implements IUser {
  constructor(
    public firstname: string,
    public lastname: string,
    public email: string,
    public password: string,
    public isVerify: boolean,
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.isVerify = isVerify;
  }
}
