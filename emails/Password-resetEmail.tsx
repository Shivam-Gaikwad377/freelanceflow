import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface PasswordResetProps {
  verificationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const footer = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "8px",
};

const anchor = {
  color: "#0066cc",
  textDecoration: "underline",
};

export default function PasswordResetEmail({
  verificationCode,
}: PasswordResetProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-aws text-[#212121]">
          <Preview>FreelanceFlow Password Reset</Preview>
          <Container className="p-5 mx-auto bg-[#eee]">
            <Section className="bg-white">
              <Section className="bg-primary flex py-5 items-center justify-center">
                <Img
                  src={`${baseUrl}/static/freelanceflow-logo.png`}
                  width="75"
                  height="45"
                  alt="FreelanceFlow's Logo"
                />
              </Section>
              <Section className="py-6.25 px-8.75">
                <Heading className="text-[#333] text-[20px] font-bold mb-3.75">
                  Reset your password
                </Heading>
                <Text className="text-[#333] text-[14px] leading-[24px] mt-6 mb-3.5 mx-0">
                  Thanks for requesting a password reset. Please enter the
                  following verification code when prompted. If you
                  don&apos;t want to reset your password, you can ignore this
                  message.
                </Text>
                
                <Section className="flex items-center justify-center">
                  <Text className="text-[#333] m-0 font-bold text-center text-[14px]">
                    Verification code
                  </Text>

                  <Text className="text-[#333] text-[36px] my-2.5 mx-0 font-bold text-center">
                    {verificationCode}
                  </Text>
                  <Text className="text-[#333] text-[14px] m-0 text-center">
                    (This code is valid for 10 minutes)
                  </Text>
                </Section>
              </Section>
              <Hr />
              <Section className="py-6.25 px-8.75">
                <Text className="text-[#333] text-[14px] m-0">
                  FreelanceFlow will never email you and ask you to disclose or
                  verify your password, credit card, or banking account number.
                </Text>
              </Section>
            </Section>
            <Text style={footer}>
              © 2026 FreelanceFlow · All rights reserved.
            </Text>
            <Text style={footer}>
              You're receiving this because you requested a password reset.
              If this wasn't you,{" "}
              <Link href="mailto:support@freelanceflow.app" style={anchor}>
                contact support
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

PasswordResetEmail.PreviewProps = {
  verificationCode: "596853",
} satisfies PasswordResetProps;