import axios from "axios";

const API_URL = "http://localhost:8000";

export const generateStudyPlan = async (
  topic: string,
  duration: number
): Promise<string> => {
  const response = await axios.post(`${API_URL}/generate_study_plan`, {
    topic,
    duration,
  });
  return response.data.study_plan;
};
