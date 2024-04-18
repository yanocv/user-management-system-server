import { Sequelize } from 'sequelize';
import { config } from './config';
import { User, UserInit } from './models/user.model';
import { App, AppInit } from './models/app.model';
import { Employee, EmployeeInit } from './models/employee.model';
import {
  EmployeeStatus,
  EmployeeStatusInit,
} from './models/employeeStatus.model';
import { EmployeeDummy, EmployeeDummyInit } from './models/employeeDummy.model';
import {
  EmployeeStatusDummy,
  EmployeeStatusDummyInit,
} from './models/employeeStatusDummy.model';
import { Company, CompanyInit } from './models/company.model';
import { Department, DepartmentInit } from './models/department.model';
import { Permission, PermissionInit } from './models/permission.model';
import { TopicInit } from './models/topic.model';
import { HouseStatus, HouseStatusInit } from './models/houseStatus.model';

const DB = {
  init: () => {
    const sequelize = new Sequelize(config);

    /* initialize */
    AppInit(sequelize);
    UserInit(sequelize);
    EmployeeInit(sequelize);
    EmployeeStatusInit(sequelize);
    EmployeeDummyInit(sequelize);
    EmployeeStatusDummyInit(sequelize);
    CompanyInit(sequelize);
    DepartmentInit(sequelize);
    PermissionInit(sequelize);
    TopicInit(sequelize);
    HouseStatusInit(sequelize);

    /* relation settings */

    App.hasMany(User, {
      foreignKey: 'application_id',
      sourceKey: 'application_id',
      as: 'user',
    });

    User.belongsTo(App, {
      foreignKey: 'application_id',
      targetKey: 'application_id',
      as: 'app',
    });

    App.hasMany(Employee, {
      foreignKey: 'application_id',
      sourceKey: 'application_id',
      as: 'employee',
    });

    Employee.belongsTo(App, {
      foreignKey: 'application_id',
      targetKey: 'application_id',
      as: 'app',
    });

    App.hasMany(EmployeeStatus, {
      foreignKey: 'application_id',
      sourceKey: 'application_id',
      as: 'employee_status',
    });

    EmployeeStatus.belongsTo(App, {
      foreignKey: 'application_id',
      targetKey: 'application_id',
      as: 'app',
    });

    Employee.belongsTo(Company, {
      foreignKey: 'company_id',
      targetKey: 'id',
      as: 'company',
    });

    Company.hasMany(Employee, {
      foreignKey: 'company_id',
      sourceKey: 'id',
      as: 'employee',
    });

    EmployeeStatus.belongsTo(Department, {
      foreignKey: 'department_id',
      targetKey: 'id',
      as: 'department',
    });

    Department.hasMany(EmployeeStatus, {
      foreignKey: 'department_id',
      sourceKey: 'id',
      as: 'employee_status',
    });

    EmployeeStatus.belongsTo(HouseStatus, {
      foreignKey: 'house_status_id',
      targetKey: 'id',
      as: 'house_status',
    });

    HouseStatus.hasMany(EmployeeStatus, {
      foreignKey: 'house_status_id',
      sourceKey: 'id',
      as: 'employee_status',
    });

    User.belongsTo(Permission, {
      foreignKey: 'permission_id',
      targetKey: 'id',
      as: 'permission',
    });

    Permission.hasMany(User, {
      foreignKey: 'permission_id',
      sourceKey: 'id',
      as: 'user',
    });

    Employee.hasOne(EmployeeStatus, {
      foreignKey: 'composite_id',
      sourceKey: 'composite_id',
      as: 'employee_status',
    });

    EmployeeStatus.belongsTo(Employee, {
      foreignKey: 'composite_id',
      targetKey: 'composite_id',
      as: 'employee',
    });

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ For Dummy data
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    App.hasMany(EmployeeDummy, {
      foreignKey: 'application_id',
      sourceKey: 'application_id',
      as: 'employee_dummy',
    });

    EmployeeDummy.belongsTo(App, {
      foreignKey: 'application_id',
      targetKey: 'application_id',
      as: 'app',
    });

    App.hasMany(EmployeeStatusDummy, {
      foreignKey: 'application_id',
      sourceKey: 'application_id',
      as: 'employee_status_dummy',
    });

    EmployeeStatusDummy.belongsTo(App, {
      foreignKey: 'application_id',
      targetKey: 'application_id',
      as: 'app',
    });

    EmployeeDummy.belongsTo(Company, {
      foreignKey: 'company_id',
      targetKey: 'id',
      as: 'company',
    });

    Company.hasMany(EmployeeDummy, {
      foreignKey: 'company_id',
      sourceKey: 'id',
      as: 'employee_dummy',
    });

    EmployeeDummy.hasOne(EmployeeStatusDummy, {
      foreignKey: 'composite_id',
      sourceKey: 'composite_id',
      as: 'employee_status_dummy',
    });

    EmployeeStatusDummy.belongsTo(EmployeeDummy, {
      foreignKey: 'composite_id',
      targetKey: 'composite_id',
      as: 'employee_dummy',
    });

    EmployeeStatusDummy.belongsTo(HouseStatus, {
      foreignKey: 'house_status_id',
      targetKey: 'id',
      as: 'house_status',
    });

    HouseStatus.hasMany(EmployeeStatusDummy, {
      foreignKey: 'house_status_id',
      sourceKey: 'id',
      as: 'employee_status_dummy',
    });

    EmployeeStatusDummy.belongsTo(Department, {
      foreignKey: 'department_id',
      targetKey: 'id',
      as: 'department',
    });

    Department.hasMany(EmployeeStatusDummy, {
      foreignKey: 'department_id',
      sourceKey: 'id',
      as: 'employee_status_dummy',
    });

    return sequelize;
  },
};

export { DB };
