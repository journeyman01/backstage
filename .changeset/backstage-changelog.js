/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {
  default: defaultChangelogFunctions,
} = require('@changesets/changelog-github');

// Custom CHANGELOG generation for changesets, stolen from here with one minor change:
// https://github.com/atlassian/changesets/blob/main/packages/cli/src/changelog/index.ts
async function getDependencyReleaseLine(changesets, dependenciesUpdated) {
  if (dependenciesUpdated.length === 0) return '';

  const updatedDependenciesList = dependenciesUpdated.map(
    dependency => `  - ${dependency.name}@${dependency.newVersion}`,
  );

  // Return one `Updated dependencies` bullet instead of repeating for each changeset; this
  // sacrifices the commit shas for brevity.
  return ['- Updated dependencies', ...updatedDependenciesList].join('\n');
}

async function getReleaseLine(changeset, type, options) {
  const { ignoreUserThanks = [], ...rest } = options ?? {};
  const releaseLine = await defaultChangelogFunctions.getReleaseLine(
    changeset,
    type,
    rest,
  );

  const ignoredUsers = new Set(ignoreUserThanks);
  return releaseLine.replace(/Thanks\s(.*)!\s/g, (_, text) => {
    // extracts user name and profile url from the markdown link
    const regex = /\[@(\w+)\]\((https:\/\/github\.com\/[^\)]+)\)/g;

    let matches;
    const links = [];

    while ((matches = regex.exec(text)) !== null) {
      const [, user, url] = matches;
      if (!ignoredUsers.has(user)) {
        links.push(`[@${user}](${url})`);
      }
    }

    return links.length ? `Thanks ${links.join(', ')}! ` : '';
  });
}

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
};
