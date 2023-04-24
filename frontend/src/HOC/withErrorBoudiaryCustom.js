/* eslint-disable no-console */
import React from 'react'
import { Button, Result, Space } from 'antd'
import { Link } from 'react-router-dom'
import { withErrorBoundary } from 'react-error-boundary'

export const withCustomErrorBoundary = (
  Component
) => {
  return withErrorBoundary(Component, {
    FallbackComponent: ({ error, resetErrorBoundary }) => (
      <Result
        status="warning"
        title={
          <Space direction="vertical">
            <div>There are some problems:</div>
            <div>
              <code style={{ fontSize: 'small' }}>{error.message}</code>
            </div>
          </Space>
        }
        extra={
          <Space>
            <Button type="default" onClick={resetErrorBoundary}>
              Try Again
            </Button>
            <Button type="primary" onClick={resetErrorBoundary}>
              <Link to={'/'}>Back home</Link>
            </Button>
          </Space>
        }
      />
    ),
    onError: (error, info) => {
      console.error(error, info)
    },
  })
}
