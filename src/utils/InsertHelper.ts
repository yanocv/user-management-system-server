import moment from "moment";

const DATE_FORMAT = "YYYY-MM-DD";
const CALC_TYPE = {
  years: "years",
  months: "months",
  days: "days",
} as const;

type CalcValueType = (typeof CALC_TYPE)[keyof typeof CALC_TYPE];

export const calcDiff = (
  from: string,
  to: string | undefined | null,
  type: CalcValueType
) =>
  moment(to ? moment(to, DATE_FORMAT) : moment(), DATE_FORMAT).diff(from, type);

const calcEnrollmentDays = (
  enterDate: string,
  retireDate?: string | null
): string => calcDiff(enterDate, retireDate, CALC_TYPE.days).toString();

const calcEnrollmentMonths = (
  enterDate: string,
  retireDate?: string | null
): string => calcDiff(enterDate, retireDate, CALC_TYPE.months).toString();

const calcEnrollmentYears = (
  enterDate: string,
  retireDate?: string | null
): string => {
  const enrollmentMonths = calcDiff(enterDate, retireDate, CALC_TYPE.months);
  const enrollmentYears = Math.floor(enrollmentMonths / 12);
  const monthsRemainder = Math.floor(enrollmentMonths % 12);

  // NOTE: 0ヶ月の場合は表示しない
  return `${enrollmentYears}年${
    monthsRemainder === 0 ? "" : monthsRemainder + "ヶ月"
  }`.toString();
};

export const calcEnrollment = (
  enterDate: string,
  retireDate?: string | null
) => ({
  years: calcEnrollmentYears(enterDate, retireDate),
  months: calcEnrollmentMonths(enterDate, retireDate),
  days: calcEnrollmentDays(enterDate, retireDate),
});

// ************************************************************
// calculation Age
// ************************************************************

export const calcAge = (birthday: string) => calcDiff(birthday, null, "years");

export const generateSpecifyRandom = (from: number, to: number) =>
  Math.floor(Math.random() * (to - from + 1)) + from;

export const generateRandomTelephoneNumber = () => {
  const worldNumber = `0${generateSpecifyRandom(7, 9)}0`;

  let tel8Number = "";
  for (let i = 0; i < 8; i += 1) {
    tel8Number += generateSpecifyRandom(0, 9);
  }

  return `${worldNumber}${tel8Number}`;
};

export const addBeginningSentence = (
  sentence: string | number,
  addText: string,
  insertionPosition: "start" | "end" = "start"
) => {
  const strSentence =
    typeof sentence === "number" ? sentence.toString() : sentence;

  const addedSentence =
    insertionPosition === "start"
      ? `${addText}${strSentence}`
      : `${strSentence}${addText}`;

  return addedSentence;
};

export const generateRnadomDay = (year: number, month: string) => {
  switch (parseInt(month, 10)) {
    case 2:
      if (year % 4 === 0) {
        const day29 = generateSpecifyRandom(1, 29);
        return day29 < 10 ? `0${day29}` : `${day29}`;
      }
      const day28 = generateSpecifyRandom(1, 28);
      return day28 < 10 ? `0${day28}` : `${day28}`;
    case 4:
    case 6:
    case 9:
    case 11:
      const day30 = generateSpecifyRandom(1, 30);
      return day30 < 10 ? `0${day30}` : `${day30}`;
    default:
      const day31 = generateSpecifyRandom(1, 31);
      return day31 < 10 ? `0${day31}` : `${day31}`;
  }
};

export const validateDate = (data: unknown) => {
  if (typeof data !== "string") {
    console.warn("Invalid date type.");
    return false;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    if (moment(data, "YYYY-MM-DD").isValid()) {
      return true;
    }
    console.warn("Invalid date.");
    return false;
  }
  console.warn("Invalid date format.");
  return false;
};

export const toInt = (v: unknown) => {
  if (typeof v === "number") {
    return v;
  }
  if (typeof v !== "string") {
    return null;
  }
  if (/^\d+$/.test(v)) {
    return parseInt(v, 10);
  }
  return null;
};

export const validateTelephone = (v: unknown) => {
  if (typeof v !== "string") {
    return false;
  }
  if (/^\d{10, 11}$/.test(v)) {
    return true;
  }
  return false;
};

export const isEmpty = (v: unknown) => {
  if (v == null) {
    return true;
  }
  if (typeof v === "string") {
    return v.length === 0;
  }

  if (Array.isArray(v)) {
    return v.length === 0;
  }

  if (
    typeof v === "function" ||
    typeof v === "boolean" ||
    typeof v === "symbol" ||
    typeof v === "number"
  ) {
    return false;
  }

  if (typeof v === "object") {
    return Object.keys(v).length === 0;
  }
  return false;
};
