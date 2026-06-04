# ExampleHR - HCM Leave Management System

A production-ready NestJS application for managing employee leave balances and time-off requests with seamless integration to HCM systems.

## 🎯 Features

### Core Capabilities
- **Leave Balance Management**: Track employee leave balances across multiple leave types
- **Time-Off Requests**: Request, approve, and manage time-off with automatic balance deduction
- **Optimistic Locking**: Prevent race conditions during concurrent balance updates
- **Audit Trail**: Complete history of all balance modifications and approvals
- **HCM Integration**: Queue-based synchronization with HCM systems
- **Circuit Breaker Pattern**: Graceful degradation when HCM service is unavailable
- **Retry Mechanism**: Automatic retry logic for failed HCM sync operations

### Technical Features
- Built with **NestJS** and **TypeORM**
- **SQLite** database for lightweight deployment
- **TypeScript** for type safety
- **Jest** with 80-90% coverage thresholds
- Global validation pipes with class-validator
- CORS enabled for cross-origin requests
- Comprehensive error handling with custom exceptions
- Environment-based configuration management

## 📋 API Endpoints

### Leave Balance Management
