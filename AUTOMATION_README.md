# FHEVM Example Automation System

> **Quick Reference for Automation Tools**

This project includes a comprehensive automation system for generating FHEVM example projects based on this template.

## 🚀 Quick Start

### Generate a New FHEVM Project

```bash
# Using npm script
npm run create:example ../my-fhevm-project

# Or directly with ts-node
npx ts-node scripts/create-fhevm-example.ts ../my-fhevm-project
```

### Generate Documentation

```bash
# Generate all documentation
npm run generate:docs

# Or directly
npx ts-node scripts/generate-docs.ts
```

## 📁 Automation Files

| File | Purpose |
|------|---------|
| `scripts/create-fhevm-example.ts` | Generate standalone FHEVM projects |
| `scripts/generate-docs.ts` | Auto-generate documentation |
| `examples.config.ts` | Example metadata and configuration |
| `AUTOMATION_GUIDE.md` | Complete automation documentation |

## 🎯 What You Can Do

### 1. Create Standalone Examples

```bash
# Create a new project
npm run create:example ../healthcare-privacy

# Navigate and use
cd ../healthcare-privacy
npm install
npm run compile
npm test
```

**What gets created:**
- ✅ Complete smart contract
- ✅ Comprehensive test suite (40+ tests)
- ✅ Deployment scripts
- ✅ Configuration files
- ✅ Auto-generated README
- ✅ Environment templates
- ✅ Git repository

### 2. Auto-Generate Documentation

```bash
# Generate README and guides
npm run generate:docs
```

**What gets generated:**
- ✅ README.md with API reference
- ✅ GETTING_STARTED.md guide
- ✅ FHEVM pattern explanations
- ✅ Test coverage documentation
- ✅ GitBook-compatible format

### 3. Customize Examples

Edit `examples.config.ts` to:
- Add new example configurations
- Modify FHEVM patterns
- Update metadata
- Customize generation process

## 📚 Available Commands

```bash
# Automation
npm run create:example <output-dir>    # Generate new project
npm run generate:docs                  # Generate documentation

# Development
npm run compile                        # Compile contracts
npm run test                           # Run tests
npm run coverage                       # Test coverage

# Deployment
npm run deploy                         # Deploy locally
npm run deploy:sepolia                 # Deploy to Sepolia
npm run deploy:zama                    # Deploy to Zama DevNet

# Verification
npm run verify -- --network sepolia <address>

# Maintenance
npm run clean                          # Clean artifacts
npm run lint                           # Lint Solidity
npm run format                         # Format code
```

## 🎓 Learn More

- **Full Guide**: See [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md)
- **Development**: See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 💡 Use Cases

### For Developers

```bash
# Quick start on a new FHEVM project
npm run create:example ../my-project
cd ../my-project
npm install && npm test
```

### For Educators

```bash
# Create multiple examples for teaching
npm run create:example ../lesson-1-basics
npm run create:example ../lesson-2-advanced
```

### For Hackathons

```bash
# Scaffold starter project
npm run create:example ../hackathon-starter
# Customize and build!
```

## 🔧 Configuration

### Example Metadata

Configure in `examples.config.ts`:

```typescript
export const EXAMPLES = {
    'private-organ-matching': {
        name: 'Private Organ Matching',
        description: '...',
        fhevmPatterns: [...],
        category: 'Healthcare',
        difficulty: 'intermediate'
    }
};
```

### Generation Options

Modify `scripts/create-fhevm-example.ts` to customize:
- File structure
- README template
- Configuration defaults
- Initialization steps

## ⚡ Tips

1. **Test Generated Projects**: Always test generated projects before use
2. **Keep Updated**: Regenerate when dependencies update
3. **Customize**: Modify templates for your needs
4. **Document**: Add comments to help others

## 🐛 Troubleshooting

**Issue: Directory exists**
```bash
# Remove first
rm -rf ./output-dir
npm run create:example ./output-dir
```

**Issue: Cannot find module**
```bash
# Install dependencies
npm install
npm run create:example ./output
```

## 📖 Documentation Structure

```
Documentation/
├── README.md                  # Main project docs
├── AUTOMATION_README.md       # This file (quick reference)
├── AUTOMATION_GUIDE.md        # Complete automation guide
├── DEVELOPER_GUIDE.md         # Development patterns
├── CONTRIBUTING.md            # Contribution guidelines
├── BOUNTY_CHECKLIST.md        # Requirements checklist
└── docs/
    ├── GETTING_STARTED.md     # Setup guide
    └── VIDEO_SCRIPT.md        # Demo video outline
```

## 🌟 Features

- ✅ **One-command project generation**
- ✅ **Auto-generated documentation**
- ✅ **Comprehensive test suites**
- ✅ **Production-ready configuration**
- ✅ **Git initialization**
- ✅ **Environment templates**
- ✅ **TypeScript support**
- ✅ **Multiple networks**

## 🎯 Next Steps

1. Read [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md) for complete documentation
2. Try generating a project: `npm run create:example ../test-project`
3. Explore the generated code
4. Customize for your use case
5. Build amazing FHEVM applications!

## 🤝 Contributing

Improve the automation system:

1. Fork the repository
2. Make improvements
3. Test thoroughly
4. Submit pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📞 Support

- **Documentation**: [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md)
- **Community**: [Zama Discord](https://discord.com/invite/fhe-org)
- **Issues**: [GitHub Issues](https://github.com/zama-ai/fhevm/issues)

---

**Built with FHEVM by Zama** 🔐
**Automation tools for rapid FHEVM development** 🚀
