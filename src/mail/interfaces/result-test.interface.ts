export interface Recommendation {
    name: string;
    url: string;
}

export interface SendResultTestDto {
    email: string;
    name: string;
    naration: string;
    suggestMajor: Recommendation[];
}
