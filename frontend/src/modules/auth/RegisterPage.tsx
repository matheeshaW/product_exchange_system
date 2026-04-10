import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../common/api/error-message';

const RegisterPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!auth) {
    throw new Error('AuthContext not available');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await auth.register({
        email,
        password,
        name,
        phone,
        province,
        district,
      });

      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Registration failed. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Create account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-3 text-sm">
            {success}
          </div>
        )}

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Province"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
