import { useLazyGenericGetRequestQuery, useLazyGenericPostRequestQuery } from 'src/store/api/app.js'
import React, { useState } from 'react'
import { CButton, CButtonGroup, CCallout } from '@coreui/react'

/**
 * This method is responsible for handling password settings in the application.
 * It uses two custom hooks, `useLazyGenericGetRequestQuery()` and `useLazyGenericPostRequestQuery()`,
 * to fetch and update password configuration data respectively.
 *
 * The method maintains the state of a password alert visibility using the `useState()` hook.
 *
 * It also provides a switchResolver function that updates the password configuration using the editPasswordConfig function.
 * After updating the configuration, it fetches the updated configuration using getPasswordConfig to reflect the changes.
 * Finally, it sets the password alert visibility to true.
 *
 * The method renders a password style section in the UI which displays a list of resolvers.
 * The resolver that matches the current password configuration is highlighted with a primary color button.
 * By clicking on a resolver button, the switchResolver function is called to update the password configuration and show the password alert.
 *
 * @returns {React.Element} The rendered password settings component with the password style section and password alert section.
 */
export function SettingsPassword() {
  const [getPasswordConfig, getPasswordConfigResult] = useLazyGenericGetRequestQuery()
  const [editPasswordConfig, editPasswordConfigResult] = useLazyGenericPostRequestQuery()

  const [passAlertVisible, setPassAlertVisible] = useState(false)

  const switchResolver = (resolver) => {
    editPasswordConfig({ path: '/api/ExecPasswordconfig', values: { passwordType: resolver } })
    getPasswordConfig()
    setPassAlertVisible(true)
  }

  const resolvers = ['Classic', 'Correct-Battery-Horse']

  return (
    <>
      {getPasswordConfigResult.isUninitialized &&
        getPasswordConfig({ path: '/api/ExecPasswordConfig?list=true' })}
      <h3 className="underline mb-5">Password Style</h3>
      <CButtonGroup role="group" aria-label="Resolver" className="my-3">
        {resolvers.map((r, index) => (
          <CButton
            onClick={() => switchResolver(r)}
            color={
              r === getPasswordConfigResult.data?.Results?.passwordType ? 'primary' : 'secondary'
            }
            key={index}
          >
            {r}
          </CButton>
        ))}
      </CButtonGroup>
      {(editPasswordConfigResult.isSuccess || editPasswordConfigResult.isError) && (
        <CCallout
          color={editPasswordConfigResult.isSuccess ? 'success' : 'danger'}
          visible={passAlertVisible}
        >
          {editPasswordConfigResult.isSuccess
            ? editPasswordConfigResult.data.Results
            : 'Error setting password style'}
        </CCallout>
      )}
    </>
  )
}
