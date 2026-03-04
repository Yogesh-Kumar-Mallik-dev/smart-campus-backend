type Operator = "<" | ">" | "<=" | ">=" | "==" | "!=";

interface Condition {
  key: string;
  operator: Operator;
  value: any;
}

export const evaluateCondition = (
    attributes: Record<string, any>,
    condition: Condition
) => {
  const value = attributes?.[condition.key];

  switch (condition.operator) {
    case "<":
      return value < condition.value;

    case ">":
      return value > condition.value;

    case "<=":
      return value <= condition.value;

    case ">=":
      return value >= condition.value;

    case "==":
      return value == condition.value;

    case "!=":
      return value != condition.value;

    default:
      return false;
  }
};