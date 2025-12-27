# n8n-nodes-obsidian-rest

This is an n8n community node for interacting with [Obsidian](https://obsidian.md) via the [Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) plugin.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

## Features

- **Vault Files**: List, read, create, update, append, and delete files in your vault
- **Active File**: Manage the currently active file in Obsidian
- **Search**: Simple search and Dataview DQL queries
- **Commands**: List and execute Obsidian commands
- **Periodic Notes**: Manage daily, weekly, monthly, quarterly, and yearly notes
- **System**: Get API server status

## Prerequisites

1. Install the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) plugin in Obsidian
2. Enable the plugin and note your API key from settings

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-obsidian-rest`
4. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-obsidian-rest
```

## Configuration

After installation, create credentials:

1. Go to **Credentials**
2. Create new **Obsidian Local REST API** credentials
3. Enter your:
   - **Base URL**: `https://127.0.0.1:27124` (or your tunneled URL)
   - **API Key**: Your API key from Obsidian settings
   - **Ignore SSL Issues**: Enable if using self-signed certificates

## Operations

### Vault File

| Operation | Description |
|-----------|-------------|
| List Files | List files in a directory |
| Read File | Read file content (raw or JSON with metadata) |
| Create/Update File | Create new file or update existing |
| Append to File | Append content to a file |
| Delete File | Delete a file |

### Active File

| Operation | Description |
|-----------|-------------|
| Get | Get content of the active file |
| Update | Replace content of the active file |
| Append | Append content to the active file |
| Delete | Delete the active file |

### Search

| Operation | Description |
|-----------|-------------|
| Simple Search | Search using text query |
| Dataview Query | Search using Dataview DQL |

### Command

| Operation | Description |
|-----------|-------------|
| List Commands | List all available commands |
| Execute Command | Execute a specific command |

### Periodic Note

| Operation | Description |
|-----------|-------------|
| Get | Get current periodic note |
| Update | Update periodic note content |
| Append | Append to periodic note |

## Remote Access

To access Obsidian from a remote n8n instance, you can use:

- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Tailscale](https://tailscale.com/)

## License

MIT

## Links

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api)
- [API Documentation](https://coddingtonbear.github.io/obsidian-local-rest-api/)
