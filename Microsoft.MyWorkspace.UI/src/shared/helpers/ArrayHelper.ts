export class ArrayHelper {
  public static getUniqueObjectsOfArray(
    inputArray: any[],
    propertyName: string
  ): any[] {
    const seen = Object.create(null);

    const result = inputArray.filter((item) => {
      const key: any = [propertyName].map((k) => item[k]);
      if (!seen[key] && key[0] && key[0].trim() !== '') {
        seen[key] = true;
        return true;
      }

      return false;
    });

    return result;
  }
}
