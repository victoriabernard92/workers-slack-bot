import {slackWebhookUrl} from '../config';
import {fetchGithubIssue, parseGhIssueString} from '../utils/github';
import {constructGhIssueSlackMessage} from '../utils/slack';

const webhook = async request => {
  try {
    const body = await request.text();
    const {action, issue, repository} = JSON.parse(body);
    const text = `An issue was ${action}:`;
    const blocks = constructGhIssueSlackMessage(
      issue,
      repository.owner.login,
      repository.name,
      issue.number,
      text,
    );

    const postToSlack = await fetch(slackWebhookUrl, {
      body: JSON.stringify({blocks}),
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    });

    return new Response('OK');
  } catch (err) {
    const errorText = 'Unable to handle webhook';
    return new Response(errorText, {status: 500});
  }
};

export default webhook;
