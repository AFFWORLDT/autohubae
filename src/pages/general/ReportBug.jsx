import  { useState, useRef } from 'react';
import styles from "./../../styles/ReportBug.module.css"
import toast from 'react-hot-toast';
import { 
  Bug,  AlertTriangle, 
  Upload, X, Paperclip, Send
} from 'lucide-react';
import SectionTop from '../../ui/SectionTop';
import TabBar from '../../ui/TabBar';
import { REPORT_BUG_TABS } from '../../utils/constants';

function ReportBug() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'low',
    browser: '',
    email: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.browser.trim()) {
      newErrors.browser = 'Browser information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files].slice(0, 5)
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Bug report submitted successfully!');
      setFormData({
        title: '',
        description: '',
        severity: 'low',
        browser: '',
        email: '',
        attachments: []
      });
    } catch (error) {
      toast.error('Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityOptions = [
    { value: 'low', label: 'Low', class: styles.severityLow },
    { value: 'medium', label: 'Medium', class: styles.severityMedium },
    { value: 'high', label: 'High', class: styles.severityHigh },
    // { value: 'critical', label: 'Critical', class: styles.severityCritical }
  ];

  return (
    <div className="sectionContainer">
      <SectionTop heading="Report Bug">
        <TabBar
          tabs={REPORT_BUG_TABS}
          activeTab={"REPORT_BUG"}
          navigateTo={(id) => REPORT_BUG_TABS.find(tab => tab.id === id)?.path || '/admin/general/report-bug'}
        />
      </SectionTop>
      <section className="sectionStyles" style={{ backgroundColor: REPORT_BUG_TABS[0].bgColor }}>
        <div className={styles.container} style={{
          backgroundColor: REPORT_BUG_TABS[0].bgColor,
          height: "100vh"
        }}>
          <div className={styles.headerSection}>
            <h1 className={styles.title}>Report a Bug</h1>
            <p className={styles.subtitle}>
              Help us improve by reporting any issues you encounter. 
              We appreciate your feedback!
            </p>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                <Bug size={18} />
                Bug Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
                placeholder="What's the issue?"
              />
              {errors.title && (
                <span className={styles.error}>
                  <AlertTriangle size={14} />
                  {errors.title}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Please provide detailed steps to reproduce the bug..."
              />
              {errors.description && (
                <span className={styles.error}>
                  <AlertTriangle size={14} />
                  {errors.description}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <AlertTriangle size={18} />
                Severity Level
              </label>
              <div className={styles.severityOptions}>
                {severityOptions.map(option => (
                  <div
                    key={option.value}
                    className={`${styles.severityOption} ${
                      formData.severity === option.value ? styles.selected : ''
                    } ${option.class}`}
                    onClick={() => handleChange({ 
                      target: { name: 'severity', value: option.value }
                    })}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>

            {/* <div className={styles.formGroup}>
              <label htmlFor="browser" className={styles.label}>
                <Globe size={18} />
                Browser Information
              </label>
              <input
                type="text"
                id="browser"
                name="browser"
                value={formData.browser}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., Chrome 96.0.4664.93"
              />
              {errors.browser && (
                <span className={styles.error}>
                  <AlertTriangle size={14} />
                  {errors.browser}
                </span>
              )}
            </div> */}

            {/* <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={18} />
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="email@example.com"
              />
              {errors.email && (
                <span className={styles.error}>
                  <AlertTriangle size={14} />
                  {errors.email}
                </span>
              )}
            </div> */}

            <div className={styles.formGroup}>
              <div
                className={styles.attachmentArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
                <p>Drop files here or click to upload</p>
                <small>Max 5 files. Screenshots or logs are helpful!</small>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className={styles.fileInput}
                onChange={handleFileChange}
                multiple
                accept="image/*,.log,.txt"
              />
              {formData.attachments.length > 0 && (
                <div className={styles.filePreview}>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className={styles.previewItem}>
                      <Paperclip size={14} />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className={styles.removeFile}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className={styles.button}
              disabled={isSubmitting}
            >
              
              {isSubmitting ? 'Submitting...' : 'Submit Bug Report'} <Send size={20}/>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ReportBug;