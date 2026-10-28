"""
Helper script to push to GitHub using the built-in Dulwich Git engine
(Works without requiring Git for Windows installed on the system).
"""

import sys
import getpass
from pathlib import Path
from dulwich import porcelain
from dulwich.repo import Repo

def main():
    repo_dir = Path(__file__).resolve().parent
    repo = Repo(str(repo_dir))
    
    print("=" * 60)
    print("  PulseAI - Upload / Push to GitHub")
    print("=" * 60)
    print()
    print("1. Go to https://github.com/new and create a new repository")
    print("   (Do NOT check 'Add a README file' or '.gitignore').")
    print()
    
    remote_url = input("Enter your GitHub repository HTTPS URL\n(e.g., https://github.com/your-username/ai-fitness-coach.git): ").strip()
    if not remote_url:
        print("Error: Repository URL cannot be empty.")
        sys.exit(1)
        
    username = input("Enter your GitHub username: ").strip()
    token = getpass.getpass("Enter your GitHub Personal Access Token (PAT): ").strip()
    
    if not token:
        print("Error: Personal Access Token is required for authentication.")
        print("Create one at: https://github.com/settings/tokens (classic token with 'repo' scope).")
        sys.exit(1)
        
    # Configure origin
    config = repo.get_config()
    try:
        porcelain.remote_add(repo, "origin", remote_url)
        print("Configured remote 'origin'.")
    except Exception:
        # Update existing origin
        config.set(("remote", "origin"), "url", remote_url.encode("utf-8"))
        config.write_to_path()
        print("Updated remote 'origin' URL.")
        
    # Authenticated push URL: https://<username>:<token>@github.com/...
    if remote_url.startswith("https://"):
        clean_url = remote_url.replace("https://", "")
        # Remove existing credentials if user entered them in URL
        if "@" in clean_url:
            clean_url = clean_url.split("@", 1)[1]
        auth_url = f"https://{username}:{token}@{clean_url}"
    else:
        auth_url = remote_url

    print("\nPushing 'main' branch to GitHub...")
    try:
        porcelain.push(repo, auth_url, "refs/heads/main:refs/heads/main")
        print("\n" + "=" * 60)
        print(" Successfully pushed to GitHub!")
        print(f" View your project at: {remote_url.replace('.git', '')}")
        print("=" * 60)
    except Exception as e:
        print(f"\nPush failed: {e}")
        print("\nIf authentication failed, verify that:")
        print("1. Your token has the 'repo' scope checked.")
        print("2. The GitHub repository already exists.")
        sys.exit(1)

if __name__ == "__main__":
    main()
