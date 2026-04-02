<html>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Announcement Email</title>
  <style>
    /* Basic reset for email clients */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  </style>
</head>
<body style='margin: 0; padding: 0; background-color: #e9ecef; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;'>
   @include('admin.sidebar')
  <!-- Main Email Container -->
  <table width='100%' cellpadding='0' cellspacing='0' border='0' align='center' bgcolor='#e9ecef' style='background-color: #e9ecef;'>
    <tr>
      <td align='center' style='padding: 40px 20px;'>
        
        <!-- Inner Content Table (max-width: 600px) -->
        <table width='100%' max-width='600' cellpadding='0' cellspacing='0' border='0' align='center' style='max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;'>
          
          <!-- Header / Hero Section -->
          <tr>
            <td bgcolor='#1e3a5f' style='background-color: #1e3a5f; padding: 40px 30px; text-align: center;'>
              <h1 style='color: #ffffff; font-size: 26px; font-weight: 600; margin: 0 0 8px 0;'>{{ config('app.name') }}</h1>
              
            </td>
          </tr>
          
          <!-- Greeting / Body -->
          <tr>
            <td style='padding: 32px 30px 20px 30px; background-color: #ffffff;'>
              <p style='font-size: 16px; color: #2d3748; line-height: 1.5; margin-bottom: 20px;'>Dear <strong>".$customer->name."</strong>,</p>
              <p style='font-size: 16px; color: #2d3748; line-height: 1.5; margin-bottom: 20px;'>".$message."</p>
                      
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style='padding: 0 30px;'>
              <hr style='border: 0; height: 1px; background-color: #e2e8f0; margin: 8px 0;'>
            </td>
          </tr>
          
          <!-- Footer / Unsubscribe -->
          <tr>
            <td style='padding: 24px 30px 32px 30px; background-color: #ffffff;'>
              
              <p style='font-size: 12px; color: #64748b; text-align: center; margin-top: 16px;'>
                &copy;  ". date('Y')." ". config('app.name').". All rights reserved.<br>
                
              </p>
            </td>
          </tr>
          
        </table>
        <!-- End Inner Table -->
               
      </td>
    </tr>
  </table>
  <!-- End Main Container -->
  
</body>
</html>