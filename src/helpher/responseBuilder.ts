const l10n = require("jm-ez-l10n");
class ResponseBuilder {
  static success(data: any, message: string, statusCode = 200): void {
    const responseBody = {
      success: true,
      message,
      data,
    };
    return { responseBody, statusCode } as any;
  }

  static error(
    message = l10n.t("INTERNAL_SERVER_ERROR"),
    statusCode = 500
  ): void {
    const responseBody = {
      success: false,
      message,
    };
    return { responseBody, statusCode } as any;
  }

  static badRequest(message = l10n.t("BAD_REQUEST"), statusCode = 400): void {
    this.error(message, statusCode);
  }

  static invalidPassword(
    meaage = l10n.t("INVALID_PASSWORD"),
    statusCode = 400
  ) {
    return this.error(meaage, statusCode);
  }

  static invalidOTP(mesage: string, statusCode = 401): void {
    return this.error(mesage, statusCode);
  }

  static unauthorized(
    message = l10n.t("UNAUTHORIZED"),
    statusCode = 401
  ): void {
    return this.error(message, statusCode);
  }

  static notFound(message = l10n.t("NOT_FOUND"), statusCode = 404): void {
    return this.error(message, statusCode);
  }
}
export default ResponseBuilder;
