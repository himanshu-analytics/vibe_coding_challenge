import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from "@react-email/components";

interface TribeCreatedEmailProps {
  tribeName: string;
  inviteCode: string;
  inviteLink: string;
  dashboardLink: string;
}

export default function TribeCreatedEmail({
  tribeName,
  inviteCode,
  inviteLink,
  dashboardLink,
}: TribeCreatedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your tribe "{tribeName}" is ready — share your invite code: {inviteCode}</Preview>
      <Body style={{ backgroundColor: "#0d0f14", fontFamily: "sans-serif", margin: 0, padding: "40px 20px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          <Section style={{ padding: "32px 32px 0" }}>
            <Heading style={{ color: "#f0f2f8", fontSize: "22px", fontWeight: "bold", margin: "0 0 8px" }}>
              🏕️ Your tribe is live!
            </Heading>
            <Text style={{ color: "#7c849a", fontSize: "15px", margin: "0 0 24px" }}>
              <strong style={{ color: "#6EE7B7" }}>{tribeName}</strong> has been created. Share the invite code below with anyone you want to add.
            </Text>
          </Section>

          <Section style={{ margin: "0 32px", padding: "24px", backgroundColor: "#1c2030", borderRadius: "12px", border: "1px solid rgba(110,231,183,0.2)", textAlign: "center" }}>
            <Text style={{ color: "#7c849a", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>
              YOUR INVITE CODE
            </Text>
            <Text style={{ color: "#6EE7B7", fontSize: "36px", fontWeight: "bold", letterSpacing: "8px", margin: "0 0 12px", fontFamily: "monospace" }}>
              {inviteCode}
            </Text>
            <Text style={{ color: "#7c849a", fontSize: "13px", margin: "0 0 16px" }}>
              Or share this direct link:
            </Text>
            <Text style={{ color: "#818CF8", fontSize: "13px", wordBreak: "break-all", margin: 0 }}>
              {inviteLink}
            </Text>
          </Section>

          <Section style={{ padding: "24px 32px" }}>
            <Text style={{ color: "#7c849a", fontSize: "14px", margin: "0 0 20px" }}>
              Instructions: Share the code or link with your family, roommates, or anyone in your household. They'll join your tribe instantly.
            </Text>
            <Button
              href={dashboardLink}
              style={{ backgroundColor: "#6EE7B7", color: "#071a10", fontWeight: "bold", fontSize: "14px", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", display: "inline-block" }}
            >
              Go to your dashboard →
            </Button>
          </Section>

          <Hr style={{ borderColor: "rgba(255,255,255,0.07)", margin: "0 32px" }} />
          <Section style={{ padding: "16px 32px" }}>
            <Text style={{ color: "#7c849a", fontSize: "12px", margin: 0 }}>
              TribeTask — household task management for people who share spaces.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
