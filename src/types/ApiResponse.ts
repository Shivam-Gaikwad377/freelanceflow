interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    statusCode?: number;
}

export default ApiResponse;
