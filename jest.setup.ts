import '@testing-library/jest-dom'
import React from 'react'

jest.mock('next/image', () => {
  const Img = (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', { ...props, alt: props.alt ?? 'image' })
  return { __esModule: true, default: Img }
})
