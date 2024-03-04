/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// export const updateData = async (name, email) => {
//   // HTTP Request
//   // {{URL}}api/v1/users/updateMe
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
//       data: {
//         name,
//         email,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Data updated successfully!');
//     }

//     console.log(res);
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err.response.data.message);
//   }
// };

// The type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  // HTTP Request
  // {{URL}}api/v1/users/updateMe
  // {{URL}}api/v1/users/updatePassword
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:8000/api/v1/users/updatePassword'
        : 'http://127.0.0.1:8000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }

    console.log(res);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
