
import Appuser from './Appuser';

export default interface LoginResponse {
    status: 200 | 400 | 404,
    appuser?: Appuser
}