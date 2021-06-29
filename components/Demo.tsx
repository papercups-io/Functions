import React from 'react';
import {Box, Flex} from 'rebass';
import {
  Button,
  Input,
  Paragraph,
  Switch,
  TextArea,
  Title,
  Text,
} from './common';
import EmbeddableChat from './EmbeddableChat';
import CodeEditor from './CodeEditor';

export const DEMO_CHATBOT_SOURCE = `
// See https://github.com/papercups-io/papercups-node#usage
const papercups = require('@papercups-io/papercups')(
  process.env.PAPERCUPS_API_KEY
);

// This function will be exported to handle incoming webhook events!
export async function handler({event, payload}) {
  switch (event) {
    // See https://docs.papercups.io/webhook-events#messagecreated
    case 'message:created':
      const {body, conversation_id} = payload;

      // Sends an auto-response to incoming messages
      // See https://docs.papercups.io/api-endpoints#messages
      return papercups.messages.create({
        body: getResponseMessage(body),
        type: 'bot',
        conversation_id,
      });
    default:
      return {event, payload};
  }
}

function getResponseMessage(text) {
  const formatted = text.toLowerCase();

  if (formatted.includes('test')) {
    return 'Test successful!';
  } else if (formatted.includes('pricing')) {
    return 'Check out our pricing at https://papercups.io/pricing';
  } else {
    return \`This is the default message. Received: "\${text}"\`;
  }
}
`.trim();

export const DEMO_EMAIL_BOT_SOURCE = `
// See https://github.com/papercups-io/papercups-node#usage
const papercups = require('@papercups-io/papercups')(
  process.env.PAPERCUPS_API_KEY
);

// This function will be exported to handle incoming webhook events!
export async function handler({event, payload}) {
  switch (event) {
    // See https://docs.papercups.io/webhook-events#messagecreated
    case 'message:created':
      return handleMessageCreated(payload);
    default:
      return {event, payload};
  }
}

async function handleMessageCreated(message) {
  const {metadata = {}} = message;
  const subject = metadata.gmail_subject || '';
  const shouldCreateTicket =
    message.source == 'email' && subject.startsWith('[Feedback]');

  if (shouldCreateTicket) {
    // See https://docs.papercups.io/api-endpoints#messages
    const result = await papercups.github.issues.create({
      owner: "papercups-io",
      repo: "functions",
      issue: {
        title: subject.replace("[Feedback]", "").trim(), 
        body: message.body
      }
    });
    
    return papercups.messages.create({
      type: "bot",
      body: \`Thanks for your feedback! We've created a ticket: \${result.html_url}\`,
      conversation_id: message.conversation_id,
    })
  }
}
`.trim();

export const Demo = () => {
  const [demo, setDemoType] = React.useState<'chat' | 'email'>('chat');

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <Flex sx={{width: '100%', height: 560}}>
        <Box sx={{flex: 1.2, position: 'relative'}}>
          <CodeEditor
            value={
              demo === 'email' ? DEMO_EMAIL_BOT_SOURCE : DEMO_CHATBOT_SOURCE
            }
          />
        </Box>

        <Flex pl={2} sx={{flex: 1, flexDirection: 'column'}}>
          {demo === 'email' ? (
            <Box p={3} sx={{flex: 1}}>
              <Title level={3}>Email automation demo</Title>
              <Paragraph>
                Send an email to{' '}
                <a
                  href="mailto:founders@papercups.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  founders@papercups.io
                </a>{' '}
                with the subject prefix <Text strong>[Feedback]</Text> to see
                the code to the left in action!
              </Paragraph>

              <Paragraph>
                For example, send an email with the following subject and body:
              </Paragraph>

              <Box mb={3}>
                <Input
                  style={{color: 'rgba(0, 0, 0, 0.65)'}}
                  value="[Feedback] Add support for Python"
                  disabled
                />
              </Box>
              <Box mb={3}>
                <TextArea
                  style={{color: 'rgba(0, 0, 0, 0.65)'}}
                  rows={4}
                  value="It would be great if Papercups Functions supported
                Python!"
                  disabled
                />
              </Box>
              <a
                href="mailto:founders@papercups.io?subject=[Feedback] Add support for Python&body=It would be great if Papercups Functions supported
                Python!"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="primary" block>
                  Send test email
                </Button>
              </a>
            </Box>
          ) : (
            <EmbeddableChat
              sx={{flex: 1, height: '100%', width: '100%'}}
              config={{
                accountId: 'eb504736-0f20-4978-98ff-1a82ae60b266',
                primaryColor: '#1890ff',
                greeting: 'Send a message below to see the code in action!',
                newMessagePlaceholder: 'Send a test message...',
                baseUrl: 'https://alex-papercups-staging.herokuapp.com/',
              }}
            />
          )}
        </Flex>
      </Flex>

      <Flex mt={4}>
        <Box mx={2}>
          <Text type={demo === 'chat' ? null : 'secondary'}>
            Chat automation demo
          </Text>
        </Box>
        <Switch onChange={(flag) => setDemoType(flag ? 'email' : 'chat')} />
        <Box mx={2}>
          <Text type={demo === 'email' ? null : 'secondary'}>
            Email automation demo
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Demo;
