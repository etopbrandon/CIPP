import {
  useLazyExecNotificationConfigQuery,
  useLazyListNotificationConfigQuery,
} from 'src/store/api/app.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import {
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CForm,
  CSpinner,
} from '@coreui/react'
import { Form } from 'react-final-form'
import { RFFCFormInput, RFFCFormSwitch, RFFSelectSearch } from 'src/components/forms/index.js'
import React from 'react'

/**
 * Sets the notification settings.
 * @returns {JSX.Element} The notification settings component.
 */
export function SettingsNotifications() {
  const [configNotifications, notificationConfigResult] = useLazyExecNotificationConfigQuery()
  const [listNotification, notificationListResult] = useLazyListNotificationConfigQuery()
  const onSubmit = (values) => {
    configNotifications(values)
  }
  return (
    <>
      {notificationListResult.isUninitialized && listNotification()}
      {notificationListResult.isFetching && (
        <FontAwesomeIcon icon={faCircleNotch} spin className="me-2" size="1x" />
      )}
      {!notificationListResult.isFetching && notificationListResult.error && (
        <span>Error loading data</span>
      )}
      {notificationListResult.isSuccess && (
        <CCard className="h-100 w-50">
          <CCardHeader>
            <CCardTitle>Notifications</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <Form
              initialValuesEqual={() => true}
              initialValues={{
                ...notificationListResult.data,
                logsToInclude: notificationListResult.data?.logsToInclude?.map((m) => ({
                  label: m,
                  value: m,
                })),
                Severity: notificationListResult.data?.Severity?.map((s) => ({
                  label: s,
                  value: s,
                })),
              }}
              onSubmit={onSubmit}
              render={({ handleSubmit, submitting, values }) => {
                return (
                  <CForm onSubmit={handleSubmit}>
                    {notificationConfigResult.isFetching && (
                      <CCallout color="info">
                        <CSpinner>Loading</CSpinner>
                      </CCallout>
                    )}
                    {notificationConfigResult.isSuccess && (
                      <CCallout color="info">{notificationConfigResult.data?.Results}</CCallout>
                    )}
                    {notificationConfigResult.isError && (
                      <CCallout color="danger">
                        Could not connect to API: {notificationConfigResult.error.message}
                      </CCallout>
                    )}
                    <CCol>
                      <CCol>
                        <RFFCFormInput
                          type="text"
                          name="email"
                          label="E-mail (Separate multiple E-mails with commas e.g.: matt@example.com, joe@sample.com)"
                        />
                      </CCol>
                      <CCol>
                        <RFFCFormInput type="text" name="webhook" label="Webhook" />
                      </CCol>
                      <CCol>
                        <RFFSelectSearch
                          multi={true}
                          label="Choose which logs you'd like to receive alerts from. This notification will be sent every 15 minutes."
                          name="logsToInclude"
                          values={[
                            { value: 'Updates', name: 'Updates Status' },
                            { value: 'Standards', name: 'All Standards' },
                            { value: 'TokensUpdater', name: 'Token Events' },
                            {
                              value: 'ExecDnsConfig',
                              name: 'Changing DNS Settings',
                            },
                            {
                              value: 'ExecExcludeLicenses',
                              name: 'Adding excluded licenses',
                            },
                            {
                              value: 'ExecExcludeTenant',
                              name: 'Adding excluded tenants',
                            },
                            { value: 'EditUser', name: 'Editing a user' },
                            {
                              value: 'ChocoApp',
                              name: 'Adding or deploying applications',
                            },
                            {
                              value: 'AddAPDevice',
                              name: 'Adding autopilot devices',
                            },
                            { value: 'EditTenant', name: 'Editing a tenant' },
                            { value: 'AddMSPApp', name: 'Adding an MSP app' },
                            { value: 'AddUser', name: 'Adding a user' },
                            { value: 'AddGroup', name: 'Adding a group' },
                            { value: 'NewTenant', name: 'Adding a tenant' },
                            {
                              value: 'ExecOffboardUser',
                              name: 'Executing the offboard wizard',
                            },
                          ]}
                        />
                      </CCol>
                      <CCol className="mb-3">
                        <RFFSelectSearch
                          multi={true}
                          label="Choose which severity of alert you want to be notified for."
                          name="Severity"
                          values={[
                            { value: 'Alert', name: 'Alert' },
                            { value: 'Error', name: 'Error' },
                            { value: 'Info', name: 'Info' },
                            { value: 'Warning', name: 'Warning' },
                            { value: 'Critical', name: 'Critical' },
                          ]}
                        />
                      </CCol>
                      <CCol>
                        <RFFCFormSwitch
                          name="onePerTenant"
                          label="Receive one email per tenant"
                          value={false}
                        />
                      </CCol>
                      <CCol>
                        <RFFCFormSwitch
                          name="sendtoIntegration"
                          label="Send notifications to configured integration(s)"
                          value={false}
                        />
                      </CCol>
                      <CCol>
                        <RFFCFormSwitch
                          name="includeTenantId"
                          label="Include Tenant ID in alerts"
                          value={false}
                        />
                      </CCol>
                      <CButton disabled={notificationConfigResult.isFetching} type="submit">
                        Set Notification Settings
                      </CButton>
                    </CCol>
                  </CForm>
                )
              }}
            />
          </CCardBody>
        </CCard>
      )}
    </>
  )
}
