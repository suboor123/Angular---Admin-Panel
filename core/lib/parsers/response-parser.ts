export class ResponseParser {
    constructor(private response: any) {}
  
    parse() {
      const response = Object.keys(this.response);
      const parsedResponse = [
        ...response.map((key) => {
          return {
            id: key,
            ...this.response[key],
          };
        }),
      ];
      return parsedResponse;
    }
  }