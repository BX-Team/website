import { NextResponse } from 'next/server';

export interface ErrorResponse {
  ok: boolean;
  error: string;
  message: string;
}

export function errorResponse(message: string, status: number = 404): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      ok: false,
      error: status === 404 ? 'Not Found' : 'Error',
      message,
    },
    { status },
  );
}

export function successResponse<T>(data: T): NextResponse<T> {
  return NextResponse.json(data);
}
