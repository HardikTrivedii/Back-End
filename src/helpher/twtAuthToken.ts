import jwt from "jsonwebtoken";

class JwtHelper {
  private static secretKey = `${process.env.JWT_KEY}`;

  static async generateToken(
    payload: Record<string, any>, // Change the type of payload
    expiresIn: string
  ): Promise<string> {
    const plainObjectPayload = payload.toObject();
    return await jwt.sign(plainObjectPayload, this.secretKey, { expiresIn });
  }

  static async verifyToken(token: string) {
    try {
      const decoded: any = await jwt.verify(token, this.secretKey);
      return decoded as Record<string, any>;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default JwtHelper;
