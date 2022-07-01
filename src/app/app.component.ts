import { Component, TemplateRef, ViewChild } from '@angular/core';
import {UserService} from "./user.service";
import {User} from "./user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent {
  title = 'Student_Task';

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>|undefined;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>|undefined;

  editedUser: User|null = null;
  users: Array<User>;
  isNewRecord: boolean = false;
  statusMessage: string = "";

  constructor(private serv: UserService) {
    this.users = new Array<User>();
  }

  ngOnInit() {
    this.loadUsers();
  }

  //загрузка пользователей
  private loadUsers() {
    this.serv.getUsers().subscribe((data: Array<User>) => {
      this.users = data;
    });
  }
  // добавление пользователя
  addUser() {
    this.editedUser = new User(1,"asd","asd",("2005-09-01"));
    this.users.push(this.editedUser);
    this.isNewRecord = true;
  }

  // редактирование пользователя
  editUser(user: User) {
    this.editedUser = new User(user._id, user.FirstMidName, user.LastName,user.EnrollmentDate);
  }
  // загружаем один из двух шаблонов
  loadTemplate(user: User) {
    if (this.editedUser && this.editedUser._id === user._id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }
  // сохраняем пользователя
  saveUser() {
    if (this.isNewRecord) {
      // добавляем пользователя
      this.serv.createUser(this.editedUser as User).subscribe(_ => {
        this.statusMessage = 'Данные успешно добавлены',
          this.loadUsers();
      });
      this.isNewRecord = false;
      this.editedUser = null;
    } else {
      // изменяем пользователя
      this.serv.updateUser(this.editedUser as User).subscribe(_ => {
        this.statusMessage = 'Данные успешно обновлены',
          this.loadUsers();
      });
      this.editedUser = null;
    }
  }
  // отмена редактирования
  cancel() {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.users.pop();
      this.isNewRecord = false;
    }
    this.editedUser = null;
  }
  // удаление пользователя
  deleteUser(user: User) {
    this.serv.deleteUser(user._id).subscribe(_ => {
      this.statusMessage = 'Данные успешно удалены',
        this.loadUsers();
    });
  }
}
