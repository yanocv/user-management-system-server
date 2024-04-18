import moment from "moment";
import { v4 as uuidV4 } from "uuid";
import { DB } from ".";
import type { UserCreationAttributes } from "./models/user.model";
import { App } from "./models/app.model";
import { User } from "./models/user.model";
import { Employee } from "./models/employee.model";
import { EmployeeStatus } from "./models/employeeStatus.model";
import { EmployeeDummy } from "./models/employeeDummy.model";
import { EmployeeStatusDummy } from "./models/employeeStatusDummy.model";
import { Company } from "./models/company.model";
import { Department } from "./models/department.model";
import { Permission } from "./models/permission.model";
import { HouseStatus } from "./models/houseStatus.model";
import type { TopicCreationAttributes } from "./models/topic.model";
import { Topic } from "./models/topic.model";
import {
  calcDiff,
  calcAge,
  calcEnrollment,
  generateSpecifyRandom,
  generateRandomTelephoneNumber,
  generateRnadomDay,
  addBeginningSentence,
} from "@utils/InsertHelper";
import {
  COMMISSIONING_STATUS,
  COMPANY,
  CompanyType,
  DEPARTMENT,
  HOUSE_STATUS,
} from "src/constants/Database";

export const initData = async (): Promise<void> => {
  await Promise.all(createDepartment());
  await Promise.all(createPermission());
  await Promise.all(createCompany());
  await Promise.all(createJoinStatus());
  await Promise.all(createTopic());
  await createApp();
  // await createEmployee();
};

const createDepartment = (): Promise<Department>[] => {
  const names = ["開発", "ＮＷ", "検証", "オフィス", "管理"];
  return names.map((name: string, idx: number) =>
    Department.create({
      id: idx,
      name,
      is_deleted: false,
      created_id: "system",
      modified_id: "system",
    })
  );
};

const createPermission = (): Promise<Permission>[] => {
  const permissions = ["root", "管理者", "ユーザー"];
  return permissions.map((permission: string, idx: number) =>
    Permission.create({
      id: idx,
      label: permission,
      is_deleted: false,
      created_id: "system",
      modified_id: "system",
    })
  );
};

const companies = [
  "テクノインダストリーズネットワーク",
  "スカイラインウェブイノベーションズ",
  "スペクトラムインテグレーションファーム",
  "スターライトソフトウェアテクノロジーズ",
  "スウィフトオペレーションプラットフォーム",
  "シルバーアローエクスプレス",
  "サミットテックリソーシーズ",
  "ソラリスイノベーションリサーチ",
  "グローバルソリューショングループ",
  "サンライズソリューションズクオリティ",
  "プライムデータアナリティクス",
  "ヴァンガードパフォーマンスリソーシーズ",
  "ピナクルロジスティクスディベロプメント",
  "ピークラーニングキッツ",
  "ポラリスフィナンシャルロジスティクス",
  "プレスティージユーティリティサービス",
  "フェニックスグロースオポチュニティーズ",
  "ルナービジネスクエスト",
  "ライトハウスビジネスアドバイザーズ",
  "ビジョナリーリーダーシップボード",
  "リバティービジネスグループ",
  "ルミナスビジネスクラウド",
  "ルナーベースジュピター",
  "ライオンハートビジネスソリューションズ",
  "ルネッサンスインフォメーションシステムズ",
  "ロケットエンジニアリングソリューションズ",
  "ヴェロシティロボティクスインク",
  "ラピッドローンチオペレーションズ",
  "ライジングエッジエキスパティーズ",
  "ゼニスホールディングスダイナミクス",
  "ゼニスリソースキングダム",
  "ゼニスリサーチグループ",
  "ゼニスメディアリレーションズ",
];

const abbreviations = [
  "SIN",
  "SWI",
  "SIF",
  "SST",
  "SOP",
  "SAX",
  "STR",
  "SIR",
  "SGK",
  "SSQ",
  "PDA",
  "VPR",
  "PLD",
  "PLK",
  "PFL",
  "PUS",
  "PGO",
  "LBQ",
  "LBA",
  "VLB",
  "LBG",
  "LBC",
  "LBJ",
  "LBS",
  "RIS",
  "RKE",
  "VRI",
  "RLO",
  "REX",
  "ZHD",
  "ZRK",
  "ZRG",
  "ZMR",
];

const createCompany = (): Promise<Company>[] => {
  return companies.map((company: string, idx: number) =>
    Company.create({
      name: company,
      abbreviation: abbreviations[idx],
      is_deleted: false,
      created_id: "system",
      modified_id: "system",
    })
  );
};

const createJoinStatus = () => {
  const status = ["在籍", "退職", "入社待ち", "入社取り消し", "休職"];
  return status.map((state: string, idx: number) =>
    HouseStatus.create({
      id: idx,
      label: state,
      created_id: "system",
      modified_id: "system",
    })
  );
};

const createTopic = (): Promise<Topic>[] => {
  const topics: TopicCreationAttributes[] = [
    {
      title: "新機能リリースのお知らせ",
      contents: "新しい機能をリリースしました。詳細はこちらをご確認ください。",
      created_id: "system",
      modified_id: "system",
    },
    {
      title: "メンテナンスのお知らせ",
      contents:
        "下記の時間よりメンテナンスを実施致します。\n日時: 12/26(日) 2:00 ~ 4:00\n\nメンテナンス中はサイトへのログインはできなくなりますのでご了承くださいますようお願い致します。",
      published_date: "2021-12-13",
      created_id: "system",
      modified_id: "system",
    },
    {
      title: "重要なアップデート情報",
      contents:
        "重要なアップデートが行われました。詳細はこちらをご覧ください。",
      published_date: "2021-10-13",
      created_id: "system",
      modified_id: "system",
    },
    {
      title: "テストテストテストテスト",
      contents:
        "てすとコンテンツあいうえおaiueo2134567890-=][\\';/.,,,/.[;;;];\\]\\[-09-8,/'{}|{}|{|:\":>><?>+_+@!#ここにはダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\n\n\n\n\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。",
      published_date: "2021-11-12",
      created_id: "system",
      modified_id: "system",
    },
    {
      title: "テスト1テストテスト2テスト3",
      contents:
        "てすとコンテンツあいうえおaiueo2134567890-=][\\';/.,,,/.[;;;];\\]\\[-09-8,/'{}|{}|{|:\":>><?>+_+@!#ここにはダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\n\n\n\n\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。",
      published_date: "1992-2-29",
      created_id: "system",
      modified_id: "system",
    },
    {
      title: "削除済み",
      contents:
        "てすとコンテンツあいうえおaiueo2134567890-=][\\';/.,,,/.[;;;];\\]\\[-09-8,/'{}|{}|{|:\":>><?>+_+@!#ここにはダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\n\n\n\n\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。",
      published_date: "1992-2-29",
      is_deleted: true,
      created_id: "system",
      modified_id: "system",
    },
    {
      title: "あああああああああああ",
      contents:
        "てすっっっっっっっv３ーr７ーくぅ２r「’２k３r」q２＝ーとコンテンツあいうえおaiueo2134567890-=][\\';/.,,,/.[;;;];\\]\\[-09-8,/'{}|{}|{|:\":>><?>+_+@!#ここにはダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます\n\n\n\n\nダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されますダミーテキストが挿入されます。",
      published_date: "2299-1-12",
      created_id: "system",
      modified_id: "system",
    },
  ];

  return topics.map((topic: TopicCreationAttributes) =>
    Topic.create({
      ...topic,
    })
  );
};

const createApp = async () => {
  const uuid1 = uuidV4();

  const app1 = await App.create({ application_id: uuid1 });

  await Promise.all([
    app1.createUser({
      application_id: app1.application_id,
      username: "system",
      password: "psystem",
      permission_id: 0,
      created_id: "system",
      modified_id: "system",
    }),
    app1.createUser({
      application_id: app1.application_id,
      username: "adm",
      password: "padm",
      permission_id: 1,
      created_id: "system",
      modified_id: "system",
    }),
    app1.createUser({
      application_id: app1.application_id,
      username: "user",
      password: "puser",
      permission_id: 2,
      created_id: "system",
      modified_id: "system",
    }),
  ]);

  await generateEmployee(app1);
  await generateEmployee(app1, true);
};

const generateEmployee = async (app: App, isDummy = false) => {
  const sequelize = DB.init();

  const fn = async (i: number) => {
    const transaction = await sequelize.transaction({ autocommit: false });

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Company ID
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const randomCompanyId = generateSpecifyRandom(1, 33);

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Birthday
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const now = moment();
    const nowYear = now.year();

    const maxEmployeeAge = 56;
    const minEmployeeAge = 19;
    const maxBirthdayYear = nowYear - minEmployeeAge;
    const minBirthdayYear = nowYear - maxEmployeeAge;

    const randomBirthdayYear = generateSpecifyRandom(
      minBirthdayYear,
      maxBirthdayYear
    );

    const tempBirthdayMonth = generateSpecifyRandom(1, 12);
    const randomBirthdayMonth =
      tempBirthdayMonth < 10 ? `0${tempBirthdayMonth}` : `${tempBirthdayMonth}`;

    const randomBirthdayDay = generateRnadomDay(
      randomBirthdayYear,
      randomBirthdayMonth
    );

    const randomBirthday = `${randomBirthdayYear}-${randomBirthdayMonth}-${randomBirthdayDay}`;

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Sex
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const sex = generateSpecifyRandom(0, 1);

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Telephone Number
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const randomTelephoneNumber = generateRandomTelephoneNumber();

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Age
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const age = calcAge(randomBirthday);

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Enter Date
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const establishedDay = 2008;

    const diffNowEstablish = nowYear - establishedDay;
    const diffAgeMin = age + 1 - minEmployeeAge;

    const enterYearFrom =
      diffNowEstablish > diffAgeMin ? nowYear - diffAgeMin : establishedDay;
    const enterYearTo = nowYear;

    const randomEnterYear = generateSpecifyRandom(enterYearFrom, enterYearTo);

    const tempEnterMonth = (() => {
      if (randomEnterYear === nowYear) {
        return generateSpecifyRandom(
          1,
          moment().add(generateSpecifyRandom(1, 2), "months").month()
        );
      }
      return generateSpecifyRandom(1, 12);
    })();

    const randomEnterMonth =
      tempEnterMonth < 10 ? `0${tempEnterMonth}` : `${tempEnterMonth}`;

    const randomEnterDay = generateRnadomDay(randomEnterYear, randomEnterMonth);

    // YYYY-MM-dd
    const enterDate = `${randomEnterYear}-${randomEnterMonth}-${randomEnterDay}`;

    const enterDateIsOverNow = moment(enterDate).isAfter(now);

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Retire Date
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const diffNowEnterDateDay = calcDiff(enterDate, null, "days");

    const minRetireDay = 40;
    const randomRetireDay = generateSpecifyRandom(
      diffNowEnterDateDay < minRetireDay
        ? generateSpecifyRandom(1, diffNowEnterDateDay)
        : minRetireDay,
      diffNowEnterDateDay
    );

    const retireDate =
      !enterDateIsOverNow && generateSpecifyRandom(1, 100) <= 48
        ? moment(enterDate).add(randomRetireDay, "days").format("YYYY-MM-DD")
        : null;

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Enrollment
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const enrollment = enterDateIsOverNow
      ? { years: "0年", months: "0", days: "0" }
      : calcEnrollment(enterDate, retireDate);

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Deleted Flag
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    // 退職者は10%の確率で論理削除されている
    const is_deleted = !!retireDate && Math.floor(Math.random() * 10) === 0;

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Department ID
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    // 割合 Total 100
    // 開発：27, NW: 27, 検証: 26, オフィス: 5, 管理: 15
    const tempDepartment = generateSpecifyRandom(1, 100);
    const departmentId = (() => {
      if (1 <= tempDepartment && tempDepartment <= 34) return DEPARTMENT.DEV;
      if (35 <= tempDepartment && tempDepartment <= 60) return DEPARTMENT.NW;
      if (61 <= tempDepartment && tempDepartment <= 80)
        return DEPARTMENT.VERIFY;
      if (81 <= tempDepartment && tempDepartment <= 85)
        return DEPARTMENT.OFFICE;
      if (86 <= tempDepartment && tempDepartment <= 100)
        return DEPARTMENT.MANAGE;
      return DEPARTMENT.DEV;
    })();

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆ generate Commissioning Status
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    // NOTE: retireDateがあるのに 1=稼働 はおかしいので数値を変える
    // NOTE: retireDateがない場合、33%の確率で未稼働
    const commissioningStatusId =
      retireDate || enterDateIsOverNow
        ? COMMISSIONING_STATUS.NOT_COMMIT
        : generateSpecifyRandom(0, 3) === 0
        ? COMMISSIONING_STATUS.NOT_COMMIT
        : COMMISSIONING_STATUS.COMMIT;

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // 　◆　generate House Status
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    const random = generateSpecifyRandom(1, 10);
    const randomResult = random < 10 ? HOUSE_STATUS.JOIN : HOUSE_STATUS.REST;

    // TODO: WARNING: 現状のデータでは concel （入社キャンセル）の人は存在しない
    const houseStatusId = retireDate
      ? HOUSE_STATUS.RETIRE // NOTE: retireDateがある場合、強制的に退職
      : enterDateIsOverNow === true
      ? HOUSE_STATUS.WAIT // NOTE: 入社日が未来日の場合、強制的に入社待ち
      : randomResult; // NOTE: 上記以外の場合、90%の確率で入社、10%の確率で休職中

    // WARNING: 途中のレコードを削除すると同じ ID ができるので注意
    const count = isDummy
      ? (await app.countEmployee_dummy()) + 1
      : (await app.countEmployee()) + 1;

    // ########################################################################
    if (isDummy) {
      try {
        const createdEmployeeData = await app.createEmployee_dummy(
          {
            composite_id: `${count}-${app.application_id}`,
            employee_id: count,
            application_id: app.application_id,
            first_name: "テクノ",
            last_name: `${sex === 0 ? "鈴木" : "大介"}${i}`,
            first_name_hiragana: "てくの",
            last_name_hiragana: `${sex === 0 ? "すずき" : "だいすけ"}${i}`,
            company_id: randomCompanyId,
            birthday: randomBirthday,
            sex,
            age,
            mail: `sample${i}@world.jp`,
            telephone: randomTelephoneNumber,
            enter_date: enterDate,
            retire_date: retireDate,
            enter_date_milliseconds: moment(enterDate).valueOf(),
            retire_date_milliseconds: moment(retireDate).valueOf(),
            enrollment_year: enrollment.years,
            enrollment_month: enrollment.months,
            enrollment_day: enrollment.days,
            is_deleted,
            created_id: "system",
            modified_id: "system",
          },
          { transaction }
        );

        const createdEmployeeStatus = await EmployeeStatusDummy.create(
          {
            composite_id: `${count}-${app.application_id}`,
            employee_id: count,
            application_id: app.application_id,
            business_manager: `みきたに${i}`,
            department_id: departmentId,
            commissioning_status_id: commissioningStatusId,
            house_status_id: houseStatusId,
            is_deleted,
            created_id: "system",
            modified_id: "system",
          },
          { transaction }
        );
        await transaction.commit();
      } catch (err) {
        console.error(err);
        await transaction.rollback();
      }
    } else {
      try {
        const createdEmployeeData = await app.createEmployee(
          {
            composite_id: `${count}-${app.application_id}`,
            employee_id: count,
            application_id: app.application_id,
            first_name: "テクノ",
            last_name: `${sex === 0 ? "鈴木" : "大介"}${i}`,
            first_name_hiragana: "てくの",
            last_name_hiragana: `${sex === 0 ? "すずき" : "だいすけ"}${i}`,
            company_id: randomCompanyId,
            birthday: randomBirthday,
            sex,
            age,
            mail: `sample${i}@secure-i.jp`,
            telephone: randomTelephoneNumber,
            enter_date: enterDate,
            retire_date: retireDate,
            enter_date_milliseconds: moment(enterDate).valueOf(),
            retire_date_milliseconds: moment(retireDate).valueOf(),
            enrollment_year: enrollment.years,
            enrollment_month: enrollment.months,
            enrollment_day: enrollment.days,
            is_deleted,
            created_id: "system",
            modified_id: "system",
          },
          { transaction }
        );

        const createdEmployeeStatus = await EmployeeStatus.create(
          {
            composite_id: `${count}-${app.application_id}`,
            employee_id: count,
            application_id: app.application_id,
            business_manager: `管理大介${i}`,
            department_id: departmentId,
            commissioning_status_id: commissioningStatusId,
            house_status_id: houseStatusId,
            is_deleted,
            created_id: "system",
            modified_id: "system",
          },
          { transaction }
        );
        await transaction.commit();
      } catch (err) {
        console.error(err);
        await transaction.rollback();
      }
    }
  };

  const num = isDummy ? 14234 : 4;
  for (let i = 1; i <= num; i += 1) {
    await fn(i);
  }
};
