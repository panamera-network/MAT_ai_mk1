# Base image for core/desktop-mcp-server.ts's execute_terminal_command sandbox.
# Matches core/mcp_approvals.py's ALLOWED_COMMAND_PREFIXES (git, npm, python, pytest,
# pip, node) minus "docker" itself — a sandboxed command must never be able to invoke
# docker, since that would allow mounting the Docker socket and escaping the sandbox
# entirely (a known container-escape vector).
#
# Build: docker build -f docker/sandbox.Dockerfile -t mat-ai-sandbox:latest .

FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python3 \
    python3-pip \
    python3-venv \
    && pip3 install --break-system-packages pytest \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
