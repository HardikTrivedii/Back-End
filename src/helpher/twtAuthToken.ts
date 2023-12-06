import jwt from "jsonwebtoken";
class JwtHelper {
  private static secretKey = `${process.env.JWT_KEY}`;

  static generateToken(
    payload: Record<string, any>,
    expiresIn: string
  ): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  static verifyToken(token: string): Record<string, any> | null {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded as Record<string, any>;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default JwtHelper;
