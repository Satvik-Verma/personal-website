"use client";

import { Component, ReactNode } from "react";
import HeroFallback from "./HeroFallback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class HeroErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("3D Hero failed to load, using fallback:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return <HeroFallback />;
    }
    return this.props.children;
  }
}
