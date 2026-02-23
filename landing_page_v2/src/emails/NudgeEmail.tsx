import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from "@react-email/components";

interface NudgeEmailProps {
  senderName: string;
  recipientName: string;
  taskTitle: string;
  taskDescription?: string | null;
  dueDate?: string | null;
  dashboardLink: string;
}

export default function NudgeEmail({
  senderName,
  recipientName,
  taskTitle,
  taskDescription,
  dueDate,
  dashboardLink,
}: NudgeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{senderName} nudged you about: {taskTitle}</Preview>
      <Body style={{ backgroundColor: "#0d0f14", fontFamily: "sans-serif", margin: 0, padding: "40px 20px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          <Section style={{ padding: "32px 32px 0" }}>
            <Heading style={{ color: "#f0f2f8", fontSize: "22px", fontWeight: "bold", margin: "0 0 8px" }}>
              👋 Hey {recipientName}!
            </Heading>
            <Text style={{ color: "#7c849a", fontSize: "15px", margin: "0 0 24px" }}>
              <strong style={{ color: "#6EE7B7" }}>{senderName}</strong> nudged you about a pending task.
            </Text>
          </Section>

          <Section style={{ margin: "0 32px", padding: "20px", backgroundColor: "#1c2030", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Text style={{ color: "#f0f2f8", fontWeight: "bold", fontSize: "16px", margin: "0 0 6px" }}>
              {taskTitle}
            </Text>
            {taskDescription && (
              <Text style={{ color: "#7c849a", fontSize: "14px", margin: "0 0 8px" }}>
                {taskDescription}
              </Text>
            )}
            {dueDate && (
              <Text style={{ color: "#FB923C", fontSize: "13px", margin: 0 }}>
                📅 Due: {new Date(dueDate).toLocaleDateString()}
              </Text>
            )}
          </Section>

          <Section style={{ padding: "24px 32px 32px" }}>
            <Button
              href={dashboardLink}
              style={{ backgroundColor: "#6EE7B7", color: "#071a10", fontWeight: "bold", fontSize: "14px", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", display: "inline-block" }}
            >
              View Task →
            </Button>
          </Section>

          <Hr style={{ borderColor: "rgba(255,255,255,0.07)", margin: "0 32px" }} />
          <Section style={{ padding: "16px 32px" }}>
            <Text style={{ color: "#7c849a", fontSize: "12px", margin: 0 }}>
              You received this because someone on your tribe nudged you. Manage your notifications in your tribe settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
